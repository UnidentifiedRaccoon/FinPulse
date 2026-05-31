import importlib.util
import json
import pathlib
import time
import unittest
from unittest import mock


MODULE_PATH = pathlib.Path(__file__).with_name("index.py")


def load_module():
    spec = importlib.util.spec_from_file_location("finpulse_db_control_index", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class HandlerTest(unittest.TestCase):
    def setUp(self):
        self.module = load_module()
        self.config = {
            "cluster_id": "cluster-1",
            "session_seconds": 7200,
            "wait_seconds": 540,
            "label_wait_seconds": 45,
            "token": "token",
        }

    def decode(self, response):
        return response["statusCode"], json.loads(response["body"])

    def test_load_config_uses_finpulse_env_defaults(self):
        with (
            mock.patch.dict("os.environ", {"FINPULSE_DB_CLUSTER_ID": "cluster-1"}, clear=True),
            mock.patch.object(self.module, "_get_iam_token", return_value="token"),
        ):
            config = self.module._load_config()

        self.assertEqual(config["cluster_id"], "cluster-1")
        self.assertEqual(config["session_seconds"], 7200)
        self.assertEqual(config["wait_seconds"], 540)
        self.assertEqual(config["label_wait_seconds"], 45)

    def test_stopped_cluster_starts_before_label_update(self):
        calls = []

        def get_cluster(config):
            calls.append("get")
            if calls.count("get") == 1:
                return {"name": "finpulse-db", "status": "STOPPED", "labels": {}}
            return {"name": "finpulse-db", "status": "RUNNING", "labels": {}}

        def post_action(config, action):
            calls.append(action)
            return {"id": f"{action}-operation"}

        def update_labels(config, labels):
            calls.append("labels")
            self.assertIn("active_until", labels)
            self.assertEqual(labels["managed_by"], "finpulse-db-control")
            return {"id": "label-operation"}

        with (
            mock.patch.object(self.module, "_load_config", return_value=self.config),
            mock.patch.object(self.module, "_get_cluster", side_effect=get_cluster),
            mock.patch.object(self.module, "_post_cluster_action", side_effect=post_action),
            mock.patch.object(self.module, "_update_labels", side_effect=update_labels),
            mock.patch.object(self.module, "_wait_operation", return_value={"done": True}),
        ):
            status, body = self.decode(self.module.start({}, None))

        self.assertEqual(status, 200)
        self.assertEqual(body["action"], "start-completed")
        self.assertLess(calls.index("start"), calls.index("labels"))

    def test_running_cluster_extends_lease_without_start(self):
        with (
            mock.patch.object(self.module, "_load_config", return_value=self.config),
            mock.patch.object(
                self.module,
                "_get_cluster",
                return_value={"name": "finpulse-db", "status": "RUNNING", "labels": {}},
            ),
            mock.patch.object(self.module, "_post_cluster_action") as post_action,
            mock.patch.object(self.module, "_update_labels", return_value={"id": "label-operation"}) as update_labels,
        ):
            status, body = self.decode(self.module.start({}, None))

        self.assertEqual(status, 200)
        self.assertEqual(body["action"], "extend-requested")
        post_action.assert_not_called()
        update_labels.assert_called_once()

    def test_transient_start_status_does_not_mutate(self):
        for cluster_status in ("STARTING", "UPDATING", "STOPPING"):
            with self.subTest(cluster_status=cluster_status):
                with (
                    mock.patch.object(self.module, "_load_config", return_value=self.config),
                    mock.patch.object(
                        self.module,
                        "_get_cluster",
                        return_value={"name": "finpulse-db", "status": cluster_status, "labels": {}},
                    ),
                    mock.patch.object(self.module, "_post_cluster_action") as post_action,
                    mock.patch.object(self.module, "_update_labels") as update_labels,
                ):
                    status, body = self.decode(self.module.start({}, None))

                self.assertEqual(status, 202)
                self.assertEqual(body["action"], "cluster-operation-in-progress")
                post_action.assert_not_called()
                update_labels.assert_not_called()

    def test_expired_autostop_stops_running_cluster(self):
        with (
            mock.patch.object(self.module, "_load_config", return_value=self.config),
            mock.patch.object(
                self.module,
                "_get_cluster",
                return_value={
                    "name": "finpulse-db",
                    "status": "RUNNING",
                    "labels": {"active_until": str(int(time.time()) - 1)},
                },
            ),
            mock.patch.object(self.module, "_post_cluster_action", return_value={"id": "stop-operation"}) as post_action,
        ):
            status, body = self.decode(self.module.autostop({}, None))

        self.assertEqual(status, 200)
        self.assertEqual(body["action"], "stop")
        post_action.assert_called_once_with(self.config, "stop")

    def test_missing_active_until_autostop_stops_running_cluster(self):
        with (
            mock.patch.object(self.module, "_load_config", return_value=self.config),
            mock.patch.object(
                self.module,
                "_get_cluster",
                return_value={"name": "finpulse-db", "status": "RUNNING", "labels": {}},
            ),
            mock.patch.object(self.module, "_post_cluster_action", return_value={"id": "stop-operation"}) as post_action,
        ):
            status, body = self.decode(self.module.autostop({}, None))

        self.assertEqual(status, 200)
        self.assertEqual(body["action"], "stop")
        post_action.assert_called_once_with(self.config, "stop")

    def test_active_lease_autostop_noops(self):
        with (
            mock.patch.object(self.module, "_load_config", return_value=self.config),
            mock.patch.object(
                self.module,
                "_get_cluster",
                return_value={
                    "name": "finpulse-db",
                    "status": "RUNNING",
                    "labels": {"active_until": str(int(time.time()) + 3600)},
                },
            ),
            mock.patch.object(self.module, "_post_cluster_action") as post_action,
        ):
            status, body = self.decode(self.module.autostop({}, None))

        self.assertEqual(status, 200)
        self.assertEqual(body["action"], "noop")
        self.assertEqual(body["reason"], "session-active")
        post_action.assert_not_called()

    def test_transient_autostop_status_does_not_mutate(self):
        for cluster_status in ("STARTING", "UPDATING", "STOPPING"):
            with self.subTest(cluster_status=cluster_status):
                with (
                    mock.patch.object(self.module, "_load_config", return_value=self.config),
                    mock.patch.object(
                        self.module,
                        "_get_cluster",
                        return_value={"name": "finpulse-db", "status": cluster_status, "labels": {}},
                    ),
                    mock.patch.object(self.module, "_post_cluster_action") as post_action,
                ):
                    status, body = self.decode(self.module.autostop({}, None))

                self.assertEqual(status, 200)
                self.assertEqual(body["action"], "noop")
                self.assertEqual(body["reason"], "transient-status")
                post_action.assert_not_called()


if __name__ == "__main__":
    unittest.main()
