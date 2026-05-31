// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolveDatabaseUrlWithSecrets, type DatabaseEnvironment } from './connection'

const BASE_DB_ENV = {
  NODE_ENV: 'production',
  FINPULSE_DATABASE_HOST: 'rc1a.example.mdb.yandexcloud.net',
  FINPULSE_DATABASE_PORT: '6432',
  FINPULSE_DATABASE_NAME: 'finpulse',
  FINPULSE_DATABASE_USER: 'finpulse_app',
  FINPULSE_DATABASE_SSLMODE: 'require',
} satisfies DatabaseEnvironment

describe('database connection environment resolution', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses an explicit database password without calling Lockbox', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const databaseUrl = await resolveDatabaseUrlWithSecrets({
      ...BASE_DB_ENV,
      FINPULSE_DATABASE_PASSWORD: 'plain-password',
      FINPULSE_DATABASE_PASSWORD_SECRET_ID: 'secret-id',
    })

    expect(databaseUrl).toBe(
      'postgres://finpulse_app:plain-password@rc1a.example.mdb.yandexcloud.net:6432/finpulse?sslmode=require',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('can opt into libpq-compatible sslmode=require handling', async () => {
    const databaseUrl = await resolveDatabaseUrlWithSecrets({
      ...BASE_DB_ENV,
      FINPULSE_DATABASE_PASSWORD: 'plain-password',
      FINPULSE_DATABASE_SSL_LIBPQ_COMPAT: 'true',
    })

    expect(databaseUrl).toBe(
      'postgres://finpulse_app:plain-password@rc1a.example.mdb.yandexcloud.net:6432/finpulse?sslmode=require&uselibpqcompat=true',
    )
  })

  it('fetches the database password from Yandex Lockbox through the metadata IAM token', async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input)

      if (url === 'https://metadata.test/token') {
        return jsonResponse({
          access_token: 'metadata-iam-token',
        })
      }

      if (url === 'https://payload.test/lockbox/v1/secrets/secret-id/payload?versionId=version-id') {
        return jsonResponse({
          entries: [
            {
              key: 'postgresql_password',
              textValue: 'lockbox-password',
            },
          ],
        })
      }

      return jsonResponse({}, 404)
    })
    vi.stubGlobal('fetch', fetchMock)

    const databaseUrl = await resolveDatabaseUrlWithSecrets({
      ...BASE_DB_ENV,
      FINPULSE_DATABASE_PASSWORD_SECRET_ID: 'secret-id',
      FINPULSE_DATABASE_PASSWORD_SECRET_VERSION_ID: 'version-id',
      FINPULSE_YC_METADATA_TOKEN_URL: 'https://metadata.test/token',
      FINPULSE_YC_LOCKBOX_PAYLOAD_BASE_URL: 'https://payload.test',
    })

    expect(databaseUrl).toBe(
      'postgres://finpulse_app:lockbox-password@rc1a.example.mdb.yandexcloud.net:6432/finpulse?sslmode=require',
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://metadata.test/token',
      expect.objectContaining({
        headers: {
          'Metadata-Flavor': 'Google',
        },
      }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      new URL('https://payload.test/lockbox/v1/secrets/secret-id/payload?versionId=version-id'),
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer metadata-iam-token',
        },
      }),
    )
  })
})

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}
