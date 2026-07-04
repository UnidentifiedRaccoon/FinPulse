import { readFileSync, writeFileSync } from "node:fs";

const section3Path =
  "src/content/levels/level_1_start/sections/section_03_risk_and_return.json";
const section4Path =
  "src/content/levels/level_1_start/sections/section_04_financial_environment.json";
const levelPath = "src/content/levels/level_1_start/level.json";

const lesson10 = {
  id: "lesson_l1_s3_l2_risk_and_return_are_linked",
  slug: "risk-and-return-are-linked",
  title: "Риск и доходность связаны",
  subtitle: "У1.10",
  description:
    "Понять, что доходность нельзя рассматривать отдельно от риска, и собрать карточку «риск↔доходность».",
  order: 2,
  estimatedMinutes: 5,
  learningGoal:
    "Понять, что возможная доходность связана с риском, и научиться задавать вопрос: что можно потерять за эту доходность.",
  mainSkill:
    "Харды: связь риска, ожидаемой доходности, возможной потери и срока",
  tags: ["L1", "risk-return", "hard-skills"],
  sourceSection:
    "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / У1.10 / Паспорт урока",
  cards: [
    {
      id: "card_l1s3l2_01_hook",
      type: "single_choice",
      order: 1,
      title: "Что важнее увидеть рядом с доходностью?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 1",
      ctaLabel: "Разобраться со связью",
      thinkingType: "understanding",
      develops: "psychology",
      checkability: "subjective",
      question:
        "После прошлого урока ты видишь новое предложение: доходность обещают **выше привычной**, но уже без фразы «без риска». Всё выглядит спокойнее.\n\nЧто первым делом хочется проверить рядом с доходностью?",
      options: [
        {
          id: "possible-loss",
          label: "Можно ли получить меньше ожидаемого",
          feedback:
            "Да, это главный вопрос про риск: что может пойти не по плану и чем это закончится.",
        },
        {
          id: "who-offers",
          label: "Кто именно предлагает продукт",
          feedback:
            "Это важный фильтр безопасности. Сегодня добавим к нему второй вопрос: **какой риск стоит рядом с доходностью**.",
        },
        {
          id: "money-term",
          label: "На какой срок нужны деньги",
          feedback:
            "Хорошая мысль. Срок влияет на то, какой риск человек вообще может выдержать.",
        },
      ],
    },
    {
      id: "card_l1s3l2_02_theory",
      type: "theory",
      order: 2,
      title: "Доходность и риск идут парой",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 2",
      ctaLabel: "Понятно, дальше",
      thinkingType: "memory",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Доходность — это возможный финансовый результат. Риск — это неопределённость: результат может оказаться хуже ожиданий, а часть денег можно потерять.\n\nЧем выше возможная доходность, тем важнее спросить: **«За счёт какого риска она появляется?»**\n\nВысокий риск не обещает высокую доходность автоматически. Он означает только, что разброс результатов шире: можно получить больше, меньше или потерять.",
    },
    {
      id: "card_l1s3l2_03_practice",
      type: "categorization",
      order: 3,
      title: "Разложи связки риск↔доходность",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 3",
      ctaLabel: "Дальше",
      thinkingType: "application",
      develops: "hard skills",
      checkability: "objective",
      question: "Распредели примеры по связкам **риск↔доходность**.",
      categories: [
        {
          id: "lower-risk-moderate-return",
          label: "Низкий риск и умеренная доходность",
        },
        {
          id: "higher-return-higher-risk",
          label: "Выше доходность и выше риск",
        },
        {
          id: "mismatch-red-flag",
          label: "Несостыковка / красный флаг",
        },
      ],
      items: [
        {
          id: "predictable-preserve",
          label: "Доход заранее понятен, цель — сохранить деньги",
          correctCategoryId: "lower-risk-moderate-return",
          feedback:
            "Больше предсказуемости обычно означает меньше риск и более умеренную доходность.",
        },
        {
          id: "price-can-fall",
          label: "Можно заработать больше, но цена может заметно падать",
          correctCategoryId: "higher-return-higher-risk",
          feedback:
            "Более высокий возможный результат идёт вместе с риском снижения цены.",
        },
        {
          id: "high-no-risk",
          label: "Говорят: «доход высокий, риска нет»",
          correctCategoryId: "mismatch-red-flag",
          feedback:
            "Высокая доходность без риска — несостыковка и повод остановиться.",
        },
        {
          id: "quick-access",
          label: "Главное — быстро забрать деньги без заметных потерь",
          correctCategoryId: "lower-risk-moderate-return",
          feedback:
            "Когда важны доступность и сохранность, обычно принимают более умеренную доходность.",
        },
        {
          id: "market-price",
          label: "Доход зависит от рыночной цены, результат не гарантирован",
          correctCategoryId: "higher-return-higher-risk",
          feedback:
            "Рыночная цена может двигаться в обе стороны, поэтому результат заранее не гарантирован.",
        },
        {
          id: "risk-not-explained",
          label: "Риск не объясняют, зато обещают стабильную высокую прибыль",
          correctCategoryId: "mismatch-red-flag",
          feedback:
            "Если риск скрывают, а прибыль обещают как стабильную и высокую, это красный флаг.",
        },
      ],
      feedbackTitle: "Связь поймана",
      feedback:
        "Низкий риск обычно означает больше предсказуемости и умеренную доходность. Более высокая возможная доходность требует вопроса о **возможной потере**. А «высоко и без риска» — несостыковка.",
      retryFeedbackTitle: "Проверь связку",
      retryFeedback:
        "Смотри не только на слово «доходность». Спроси: что может пойти не так, можно ли потерять деньги, и объясняют ли риск честно.",
    },
    {
      id: "card_l1s3l2_04_real_world",
      type: "scenario",
      order: 4,
      title: "Как это описывает Банк России",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 4",
      ctaLabel: "Собрать карточку",
      thinkingType: "real world A",
      develops: "hard skills",
      checkability: "objective",
      body:
        "В материалах Банка России финансовые инструменты различаются по горизонту, риску, доходности и ликвидности. Простые инструменты сбережений обычно больше про сохранность и доступность денег. Инструменты рынка капитала могут дать более высокий доход, но вместе с риском не получить доход или потерять вложенные средства.\n\nИсточник: [Вестник Банка России № 5 (2536) от 23.01.2025](https://www.cbr.ru/Queries/XsltBlock/File/87500/-1/2536).",
      question:
        "Какой вывод лучше всего передаёт связь риска и доходности?",
      options: [
        {
          id: "wrong-best-for-all",
          label: "Если возможный доход выше, значит вариант лучше для всех",
          feedback:
            "Нет. Более высокий возможный доход не делает вариант подходящим всем: важны риск, срок, ликвидность и ситуация человека.",
        },
        {
          id: "correct-watch-loss",
          label:
            "Чем выше возможный доход, тем внимательнее смотрят, что можно потерять",
          isCorrect: true,
          feedback:
            "Верно. Доходность смотрят вместе с риском: что может пойти не так и какую потерю человек теоретически может получить.",
        },
        {
          id: "wrong-low-risk-high-return",
          label: "Если риск низкий, доходность должна быть высокой",
          feedback:
            "Обычно наоборот: низкий риск чаще означает больше предсказуемости и более умеренную доходность.",
        },
      ],
      correctOptionId: "correct-watch-loss",
      feedbackTitle: "Верно",
      feedback:
        "Это учебная связка: **доходность смотрят вместе с риском, сроком и ликвидностью**. Она не говорит, какой инструмент выбрать, но помогает задать правильные вопросы.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Нельзя отделять доходность от риска. Высокая возможная доходность не делает инструмент «лучшим для всех», а низкий риск обычно не обещает высокий доход.",
    },
    {
      id: "card_l1s3l2_05_risk_return_card",
      type: "artifact",
      order: 5,
      title: "Карточка «риск↔доходность»",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 5",
      ctaLabel: "Сохранить карточку",
      thinkingType: "personal world",
      develops: "hard skills",
      checkability: "mixed",
      body:
        "Собери короткую карточку вопросов к любому финансовому предложению. Это не совет вкладывать или не вкладывать деньги, а способ не смотреть на доходность отдельно от риска.\n\nЕсли риск не получается объяснить простыми словами, карточка пока не заполнена — это повод поставить паузу и разобраться.",
      template: [
        "Доходность: что обещают или какой результат ожидают.",
        "Риск: что может пойти не так.",
        "Потери: могу ли получить меньше ожидаемого или потерять часть денег.",
        "Срок: на сколько времени деньги могут быть «заняты».",
        "Проверка: где смотреть условия, договор и официальный источник.",
      ],
    },
    {
      id: "card_l1s3l2_06_reflection",
      type: "reflection",
      order: 6,
      title: "Где сложнее всего?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 6",
      ctaLabel: "Дальше",
      thinkingType: "personal world",
      develops: "psychology",
      checkability: "subjective",
      prompt:
        "Что тебе сложнее всего удержать в голове, когда видишь **возможную доходность**?",
      inputType: "single_select",
      options: [
        "Не увлечься только цифрой доходности",
        "Понять, где именно риск",
        "Признать, что спокойный вариант может давать меньше",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
      saveKey: "risk_return_link_reflection",
      guidance:
        "Любой вариант нормален. Задача не в том, чтобы выбрать «смелый» или «осторожный» ответ, а в том, чтобы видеть пару: **доходность плюс риск**.",
    },
    {
      id: "card_l1s3l2_07_micro_rule",
      type: "artifact",
      order: 7,
      title: "Мой вопрос к доходности",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 7",
      ctaLabel: "Сделать моим правилом",
      thinkingType: "habit",
      develops: "habits",
      checkability: "mixed",
      body:
        "Выбери одно маленькое правило для Навигатора. Оно не выбирает инструмент за тебя, а помогает не отделять возможную доходность от риска.",
      variants: [
        "Если доходность выглядит выше обычной, то сначала записываю, какой риск за неё беру",
        "Если не могу объяснить риск простыми словами, то ставлю паузу и возвращаюсь к условиям и источникам",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
    },
    {
      id: "card_l1s3l2_08_summary",
      type: "summary",
      order: 8,
      title: "Карточка сохранена",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md / Экран 8",
      thinkingType: "artifact",
      develops: "habits",
      checkability: "subjective",
      body:
        "Готово. У тебя есть карточка **«риск↔доходность»**: теперь доходность не висит отдельно, рядом с ней есть вопрос о риске.",
      points: [
        "Риск и доходность связаны.",
        "Высокий риск не гарантирует высокий доход, но увеличивает разброс результата.",
        "Твой первый вопрос: что можно потерять и за счёт какого риска появляется возможная доходность.",
      ],
      nextStep:
        "В следующих уроках раздела эта карточка пригодится, когда будем связывать риск со сроком и личной целью.",
    },
  ],
};

const lesson11 = {
  id: "lesson_l1_s3_l3_money_soon_not_in_risk",
  slug: "money-soon-not-in-risk",
  title: "Деньги «на скоро» — не в риск",
  subtitle: "У1.11",
  description:
    "Понять, почему деньги на близкую цель не стоит отправлять в риск, и собрать личное правило «срок -> инструмент».",
  order: 3,
  estimatedMinutes: 5,
  learningGoal:
    "Понять, почему деньги на близкую цель не стоит отправлять в риск, и собрать личное правило «срок -> инструмент».",
  mainSkill:
    "Софт + психология: сопоставлять срок цели с допустимым риском и удерживать паузу перед риском для денег «на скоро»",
  tags: ["L1", "risk-return", "time-horizon"],
  sourceSection:
    "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / У1.11 / Паспорт урока",
  cards: [
    {
      id: "card_l1s3l3_01_hook",
      type: "single_choice",
      order: 1,
      title: "Деньги скоро нужны",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 1",
      ctaLabel: "Проверить срок и риск",
      thinkingType: "understanding",
      develops: "psychology",
      checkability: "subjective",
      question:
        "Через три месяца нужно оплатить важную цель: переезд, обучение, технику или крупный счёт. Деньги уже почти собраны. И вдруг появляется мысль: «А если пока вложить их куда-то с доходностью?»\n\nЧто ближе к твоей первой реакции?",
      options: [
        {
          id: "let-money-work",
          label: "Пусть деньги пока поработают",
          feedback:
            "Это понятное желание: не хочется, чтобы деньги «просто лежали». Дальше разберём, почему срок меняет допустимый риск.",
        },
        {
          id: "afraid-to-risk",
          label: "Страшно рисковать: срок близко",
          feedback:
            "Осторожность здесь уместна. Если дата близкая, важнее не сорвать цель.",
        },
        {
          id: "ask-drawdown",
          label: "Сначала надо понять, что будет, если сумма просядет",
          feedback:
            "Хороший вопрос. Риск особенно заметен, когда времени на восстановление уже нет.",
        },
      ],
    },
    {
      id: "card_l1s3l3_02_theory",
      type: "theory",
      order: 2,
      title: "Срок меняет допустимый риск",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 2",
      ctaLabel: "Понятно, дальше",
      thinkingType: "memory",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Если деньги нужны скоро или к конкретной дате, главный риск — что инструмент просядет или деньги нельзя будет быстро забрать без потерь.\n\nДля близкой цели важнее доступность и устойчивость суммы, чем попытка получить доход любой ценой. Рискованные инструменты могут подходить для других задач, но не для суммы, потеря или задержка которой сорвёт важную оплату.\n\nЭто не совет выбрать конкретный продукт. Это фильтр: сначала срок, ликвидность и риск просадки; потом уже сравнение инструментов.",
    },
    {
      id: "card_l1s3l3_03_practice",
      type: "categorization",
      order: 3,
      title: "Срок близкий или гибкий?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 3",
      ctaLabel: "Дальше",
      thinkingType: "application",
      develops: "hard skills",
      checkability: "objective",
      question:
        "Распредели ситуации: где нужна **доступность и устойчивость**, а где риск можно изучать отдельно.",
      categories: [
        {
          id: "stable-access",
          label: "Нужна доступность и устойчивость",
        },
        {
          id: "risk-later",
          label: "Риск можно изучать отдельно",
        },
      ],
      items: [
        {
          id: "education-two-months",
          label: "Оплата обучения через два месяца",
          correctCategoryId: "stable-access",
          feedback:
            "Срок близкий, поэтому важнее не сорвать платёж.",
        },
        {
          id: "rent-deposit-month",
          label: "Деньги на аренду и залог через месяц",
          correctCategoryId: "stable-access",
          feedback:
            "Для близкого обязательного платежа нужна доступность суммы.",
        },
        {
          id: "emergency-reserve",
          label: "Подушка на случай поломки или паузы в доходе",
          correctCategoryId: "stable-access",
          feedback:
            "Резерв нужен неожиданно, поэтому важны доступность и устойчивость.",
        },
        {
          id: "flexible-long-goal",
          label: "Цель без точной даты через несколько лет",
          correctCategoryId: "risk-later",
          feedback:
            "Если срок длинный и гибкий, риск можно изучать отдельно, не трогая близкие платежи.",
        },
        {
          id: "important-payment",
          label: "Сумма, потеря которой сорвёт важный платёж",
          correctCategoryId: "stable-access",
          feedback:
            "Если потеря сорвёт цель, это зона стабильности, а не риска.",
        },
        {
          id: "long-after-reserve",
          label: "Долгосрочная цель после отдельного резерва",
          correctCategoryId: "risk-later",
          feedback:
            "Риск можно изучать отдельно, когда близкие платежи и резерв уже защищены.",
        },
      ],
      feedbackTitle: "Хорошая работа",
      feedback:
        "Главный ориентир: чем ближе срок и жёстче дата, тем меньше места для риска просадки. Для долгого и гибкого горизонта риск изучают отдельно, без денег на ближайшие обязательства.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Смотри на два вопроса: когда нужны деньги и что будет, если сумма временно упадёт или станет недоступной. Если цель сорвётся, это зона стабильности, а не риска.",
    },
    {
      id: "card_l1s3l3_04_real_world",
      type: "scenario",
      order: 4,
      title: "Переезд через четыре месяца",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 4",
      ctaLabel: "Применить к себе",
      thinkingType: "real world A",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Лера копит на переезд через четыре месяца. Сумма почти собрана. В чате ей советуют «пока не держать деньги без дела» и отправить часть в рискованный инструмент: вдруг получится заработать больше. Банк России в материалах о финансовом рынке разделяет инструменты по горизонту, риску, доходности и ликвидности. Для денег на близкую цель важен именно этот фильтр.\n\nИсточник: [Банк России](https://www.cbr.ru/Content/Document/File/181362/onrfr_2026_2028.pdf).",
      question:
        "Какой подход лучше всего соответствует принципу «срок -> инструмент»?",
      options: [
        {
          id: "wrong-risk-four-months",
          label: "Рискнуть: четыре месяца — достаточно, чтобы успеть заработать",
          feedback:
            "Четыре месяца — близкий срок для важной цели. Риск просадки может совпасть с датой платежа.",
        },
        {
          id: "correct-separate-moving-money",
          label: "Отделить сумму на переезд и не брать на неё риск просадки",
          isCorrect: true,
          feedback:
            "Верно. Для денег с близким сроком важнее не максимальная доходность, а доступность и устойчивость.",
        },
        {
          id: "wrong-highest-return",
          label: "Выбрать то, где обещают самую высокую доходность",
          feedback:
            "Высокая доходность не решает главный риск: что будет, если сумма просядет именно к дате переезда.",
        },
      ],
      correctOptionId: "correct-separate-moving-money",
      feedbackTitle: "Верно",
      feedback:
        "Для денег с близким сроком важнее не максимальная доходность, а доступность и устойчивость. Риск просадки может совпасть с датой платежа.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "В этой ситуации ключевой вопрос не «где больше доходность», а «что будет, если сумма просядет или её нельзя будет быстро забрать».",
    },
    {
      id: "card_l1s3l3_05_time_tool_rule",
      type: "artifact",
      order: 5,
      title: "Моё правило срок -> инструмент",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 5",
      ctaLabel: "Сохранить правило",
      thinkingType: "personal world",
      develops: "hard skills",
      checkability: "mixed",
      body:
        "Собери короткий черновик по одной своей цели. Не нужно указывать точную сумму, если не хочется: достаточно цели и срока. Это личный артефакт, не тест и не рекомендация.\n\nЕсли срок близкий или потеря суммы сорвёт важную оплату, правило обычно начинается с доступности и устойчивости, а не с поиска максимальной доходности.",
      template: [
        "Цель или платёж, для которого деньги нужны: ____",
        "Срок: когда деньги понадобятся или насколько дата жёсткая: ____",
        "Что важнее для этой суммы: доступность, устойчивость, доходность: ____",
        "Моя красная граница: какую сумму или цель я не отправляю в рискованные варианты: ____",
      ],
    },
    {
      id: "card_l1s3l3_06_reflection",
      type: "reflection",
      order: 6,
      title: "Что тянет рискнуть?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 6",
      ctaLabel: "Дальше",
      thinkingType: "personal world",
      develops: "psychology",
      checkability: "subjective",
      prompt:
        "Что чаще всего может подтолкнуть рискнуть деньгами, которые скоро понадобятся?",
      inputType: "single_select",
      options: [
        "Хочется успеть заработать больше",
        "Жалко, что деньги «просто лежат»",
        "Кажется, что падение случится не сейчас",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
      saveKey: "money_soon_risk_trigger",
      guidance:
        "Любой вариант нормален. Цель — заметить свой триггер и поставить паузу до выбора инструмента.",
    },
    {
      id: "card_l1s3l3_07_micro_rule",
      type: "artifact",
      order: 7,
      title: "Моё правило срока",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 7",
      ctaLabel: "Сделать моим правилом",
      thinkingType: "habit",
      develops: "habits",
      checkability: "mixed",
      body:
        "Выбери одно маленькое правило для Навигатора. Оно не решает за тебя, куда вкладывать деньги, а помогает сначала сверить срок, ликвидность и риск просадки.",
      variants: [
        "Если деньги нужны в ближайшие месяцы или к жёсткой дате, то сначала проверяю ликвидность и риск просадки, а не обещанную доходность",
        "Если потеря или задержка денег сорвёт важную оплату, то не отправляю эту сумму в рискованные варианты",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
    },
    {
      id: "card_l1s3l3_08_summary",
      type: "summary",
      order: 8,
      title: "Правило сохранено",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md / Экран 8",
      thinkingType: "artifact",
      develops: "habits",
      checkability: "subjective",
      body:
        "Готово. В Навигаторе появилось твоё правило **«срок -> инструмент»** для денег, которые скоро понадобятся.",
      points: [
        "Близкий срок снижает допустимый риск.",
        "У тебя есть личная граница: какая цель или сумма не уходит в рискованные варианты.",
        "Микро-правило: сначала срок, ликвидность и риск просадки, потом доходность.",
      ],
      nextStep:
        "Дальше это правило поможет сравнивать инструменты не по обещанию доходности, а по связке «цель, срок, риск».",
    },
  ],
};

const lesson12 = {
  id: "lesson_l1_s3_l4_what_is_inflation",
  slug: "what-is-inflation",
  title: "Что такое инфляция",
  subtitle: "У1.12",
  description:
    "Понять, почему рост суммы на вкладе не всегда означает рост покупательной способности, и собрать правило проверки «вклад vs инфляция».",
  order: 4,
  estimatedMinutes: 5,
  learningGoal:
    "Понять, как инфляция влияет на покупательную способность, и собрать правило проверки «вклад vs инфляция».",
  mainSkill:
    "Харды: инфляция, покупательная способность, номинальная и реальная доходность",
  tags: ["L1", "risk-return", "inflation"],
  sourceSection:
    "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / У1.12 / Паспорт урока",
  cards: [
    {
      id: "card_l1s3l4_01_hook",
      type: "single_choice",
      order: 1,
      title: "Деньги выросли, а покупок меньше?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 1",
      ctaLabel: "Понять инфляцию",
      thinkingType: "understanding",
      develops: "psychology",
      checkability: "subjective",
      question:
        "Ты положил(а) деньги на вклад. Через год сумма стала больше, но привычные покупки тоже подорожали. На экране вроде плюс, а ощущение выгоды не такое очевидное.\n\nЧто первым делом хочется проверить?",
      options: [
        {
          id: "more-rubles",
          label: "Сколько рублей прибавилось на счёте",
          feedback:
            "Логично начать с суммы. Дальше добавим второй слой: **что эта сумма теперь может купить**.",
        },
        {
          id: "price-growth",
          label: "Насколько выросли цены за это время",
          feedback:
            "Хороший фокус. Инфляция как раз помогает увидеть **покупательную способность** денег.",
        },
        {
          id: "not-sure",
          label: "Не уверен(а), с чего начать",
          feedback:
            "Нормальная точка старта. Сейчас соберём простое правило проверки без сложных формул.",
        },
      ],
    },
    {
      id: "card_l1s3l4_02_theory",
      type: "theory",
      order: 2,
      title: "Инфляция — это про покупательную способность",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 2",
      ctaLabel: "Понятно, дальше",
      thinkingType: "memory",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Инфляция — это **устойчивый рост общего уровня цен**. Если цены растут, одна и та же сумма со временем покупает меньше.\n\nЕсли деньги лежат без дохода, их номинальная сумма не меняется, но покупательная способность может снижаться. Если деньги на вкладе, сумма может расти, но важно сравнить этот рост с инфляцией.\n\nБыстрая проверка: **ставка или доход по вкладу минус инфляция за похожий период**. Это не полный выбор продукта, а первый фильтр: помогает понять, сохраняется ли покупательная способность.",
    },
    {
      id: "card_l1s3l4_03_practice",
      type: "categorization",
      order: 3,
      title: "Номинал или покупательная способность?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 3",
      ctaLabel: "Дальше",
      thinkingType: "application",
      develops: "hard skills",
      checkability: "objective",
      question:
        "Распредели примеры: где речь о **количестве рублей**, а где — о том, что эти рубли могут купить.",
      categories: [
        { id: "nominal-amount", label: "Номинальная сумма" },
        { id: "purchasing-power", label: "Покупательная способность" },
      ],
      items: [
        {
          id: "account-more-rubles",
          label: "На счёте стало больше рублей",
          correctCategoryId: "nominal-amount",
          feedback: "Это номинал: сколько рублей записано на счёте.",
        },
        {
          id: "can-buy-less",
          label: "На эти деньги можно купить меньше товаров",
          correctCategoryId: "purchasing-power",
          feedback:
            "Это покупательная способность: что реально можно купить на сумму.",
        },
        {
          id: "bank-rate",
          label: "Банк показывает процент годовых",
          correctCategoryId: "nominal-amount",
          feedback:
            "Ставка показывает номинальный рост до сравнения с инфляцией и условиями.",
        },
        {
          id: "compare-inflation",
          label: "Сравниваешь ставку с инфляцией",
          correctCategoryId: "purchasing-power",
          feedback:
            "Так появляется реальная оценка: сохранилась ли покупательная способность.",
        },
        {
          id: "basket-prices-grew",
          label: "Цены на привычную корзину выросли",
          correctCategoryId: "purchasing-power",
          feedback:
            "Рост цен напрямую влияет на то, сколько товаров можно купить.",
        },
        {
          id: "interest-in-rubles",
          label: "Проценты начислили в рублях",
          correctCategoryId: "nominal-amount",
          feedback:
            "Начисленные рубли — номинальный результат, его ещё нужно сравнить с ростом цен.",
        },
      ],
      feedbackTitle: "Хорошая работа",
      feedback:
        "Да. Номинал отвечает на вопрос **«сколько рублей?»**. Покупательная способность — на вопрос **«что можно купить на эти рубли?»**. Инфляция нужна именно для второго вопроса.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Если речь о количестве рублей или проценте в договоре — это номинал. Если речь о ценах и о том, что можно купить, — это покупательная способность.",
    },
    {
      id: "card_l1s3l4_04_real_world",
      type: "scenario",
      order: 4,
      title: "Где смотреть инфляцию",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 4",
      ctaLabel: "Собрать правило",
      thinkingType: "real world A",
      develops: "soft skills",
      checkability: "objective",
      body:
        "Миша видит вклад с процентом годовых и хочет понять: эта ставка хотя бы покрывает рост цен или только увеличивает сумму в рублях? Текущие ставки и инфляция меняются, поэтому число из старой статьи может устареть.\n\nДля актуальной проверки используй официальные страницы: [Росстат «Цены, инфляция»](https://rosstat.gov.ru/statistics/price) и [Банк России «Инфляция и ключевая ставка»](https://www.cbr.ru/hd_base/infl/).",
      question:
        "Какой первый шаг лучше всего подходит для проверки «вклад vs инфляция»?",
      options: [
        {
          id: "wrong-ad-rate-only",
          label: "Смотреть только на рекламную ставку вклада",
          feedback:
            "Рекламная ставка показывает не всю картину. Нужно понять, как она соотносится с ростом цен и условиями вклада.",
        },
        {
          id: "correct-official-inflation",
          label:
            "Открыть официальный источник по инфляции и сравнить её со ставкой за близкий период",
          isCorrect: true,
          feedback:
            "Верно. Так ты сравниваешь номинальный рост с ростом цен, а не заучиваешь быстро устаревающее число.",
        },
        {
          id: "wrong-old-news",
          label: "Взять любое число инфляции из старой новости",
          feedback:
            "Число из старой новости могло устареть. Для такой проверки нужны актуальные данные на дату сравнения.",
        },
      ],
      correctOptionId: "correct-official-inflation",
      feedbackTitle: "Верно",
      feedback:
        "Смысл проверки простой: **ставка показывает номинальный рост, инфляция показывает рост цен**. Сравнение не выбирает вклад за тебя, но показывает, сохраняется ли покупательная способность.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Рекламная ставка и старая новость не дают полной картины. Для первого фильтра нужны актуальная ставка из условий вклада и актуальная инфляция из официального источника.",
      statistics: {
        title: "Официальные данные по теме",
        items: [
          {
            value: "ИПЦ",
            label:
              "Росстат публикует индексы потребительских цен: базовый официальный источник для измерения инфляции.",
          },
          {
            value: "Инфляция",
            label:
              "Банк России показывает актуальные данные по инфляции и объясняет связь инфляции с денежно-кредитной политикой.",
          },
        ],
        sources: [
          "[Росстат: цены, инфляция](https://rosstat.gov.ru/statistics/price)",
          "[Банк России: инфляция и ключевая ставка](https://www.cbr.ru/hd_base/infl/)",
          "[Банк России: что такое инфляция](https://cbr.ru/dkp/about_inflation/)",
        ],
      },
    },
    {
      id: "card_l1s3l4_05_deposit_inflation_check",
      type: "artifact",
      order: 5,
      title: "Правило «вклад vs инфляция»",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 5",
      ctaLabel: "Сохранить правило",
      thinkingType: "personal world",
      develops: "hard skills",
      checkability: "mixed",
      body:
        "Собери короткий черновик проверки. Это **образовательный фильтр**, а не рекомендация открыть или не открывать конкретный вклад.\n\nСравнение со ставкой инфляции не заменяет чтение условий: срок, порядок начисления процентов, пополнение и досрочное снятие могут менять итог.",
      template: [
        "Шаг 1: беру **ставку и срок** из условий вклада, а не только из рекламы.",
        "Шаг 2: открываю официальный источник по инфляции — Росстат или Банк России.",
        "Шаг 3: сравниваю ставку и инфляцию за близкий период: ставка ниже, примерно равна или выше.",
        "Шаг 4: если ставка ниже инфляции, помечаю: сумма может расти, а покупательная способность снижаться.",
        "Шаг 5: отдельно смотрю условия вклада, потому что сравнение с инфляцией — только первый фильтр.",
      ],
    },
    {
      id: "card_l1s3l4_06_reflection",
      type: "reflection",
      order: 6,
      title: "Что мешает учитывать инфляцию?",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 6",
      ctaLabel: "Дальше",
      thinkingType: "personal world",
      develops: "psychology",
      checkability: "subjective",
      prompt:
        "Когда видишь ставку по вкладу, что чаще всего мешает сразу сравнить её с **инфляцией**?",
      inputType: "single_select",
      options: [
        "Смотрю только на процент в рекламе",
        "Не знаю, где искать актуальную инфляцию",
        "Сложно сравнивать разные сроки",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
      saveKey: "deposit_inflation_check_barrier",
      guidance:
        "Любой вариант нормален. Цель — заметить, где нужна опора: официальный источник, сравнение сроков или пауза перед выводом.",
    },
    {
      id: "card_l1s3l4_07_micro_rule",
      type: "artifact",
      order: 7,
      title: "Моё правило проверки",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 7",
      ctaLabel: "Сделать моим правилом",
      thinkingType: "habit",
      develops: "habits",
      checkability: "mixed",
      body:
        "Выбери одно маленькое правило для Навигатора. Оно не выбирает продукт за тебя, а помогает не путать **рост суммы** с ростом покупательной способности.",
      variants: [
        "Если вижу ставку по вкладу, то сначала сравниваю её с актуальной инфляцией в официальном источнике",
        "Если ставка ниже инфляции, то помечаю: сумма может расти, а покупательная способность снижаться",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
    },
    {
      id: "card_l1s3l4_08_summary",
      type: "summary",
      order: 8,
      title: "Навигатор пополнен",
      sourceSection:
        "docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md / Экран 8",
      thinkingType: "artifact",
      develops: "habits",
      checkability: "subjective",
      body:
        "Готово. У тебя есть **правило проверки «вклад vs инфляция»**.",
      points: [
        "Инфляция снижает покупательную способность денег.",
        "Ставка вклада показывает номинальный рост, а сравнение с инфляцией помогает увидеть реальную картину.",
        "Актуальную инфляцию лучше смотреть в официальных источниках, а ставку вклада — в условиях конкретного продукта.",
      ],
      nextStep:
        "В следующих уроках раздела это правило поможет сравнивать доходность осторожнее: рядом всегда будут риск, срок, условия и цель.",
    },
  ],
};

const lesson13 = {
  id: "lesson_l1_s4_l1_bank_client_rights",
  slug: "bank-client-rights",
  title: "Права клиента банка",
  subtitle: "У1.13",
  description:
    "Понять базовые права клиента банка и собрать короткую памятку: что спросить, что сохранить, куда обратиться.",
  order: 1,
  estimatedMinutes: 5,
  learningGoal:
    "Понять базовые права клиента банка и собрать короткую памятку: что спросить, что сохранить, куда обратиться.",
  mainSkill:
    "Знание + софт: отличить рабочее действие по защите прав от мифа или рискованного обходного пути",
  tags: ["L1", "financial-environment", "consumer-rights"],
  sourceSection:
    "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / У1.13 / Паспорт урока",
  cards: [
    {
      id: "card_l1s4l1_01_hook",
      type: "single_choice",
      order: 1,
      title: "«Подпишите, это стандартно»",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 1",
      ctaLabel: "Разобраться в правах",
      thinkingType: "understanding",
      develops: "psychology",
      checkability: "subjective",
      question:
        "В банке или приложении предлагают оформить услугу. Условия длинные, менеджер торопит, а внутри может быть комиссия или допуслуга.\n\nЧто первым делом хочется сделать?",
      options: [
        {
          id: "sign-fast",
          label: "Подписать быстрее, потом разобраться",
          feedback:
            "Понятная реакция: длинные условия утомляют. Дальше соберём короткую опору, чтобы не соглашаться вслепую.",
        },
        {
          id: "ask-time",
          label: "Попросить условия и время прочитать",
          feedback:
            "Хороший ход. Пауза и понятные условия — основа спокойного решения.",
        },
        {
          id: "save-answer",
          label: "Задать вопрос и сохранить ответ",
          feedback:
            "Это уже рабочая привычка клиента: фиксировать факты, а не спорить на память.",
        },
      ],
    },
    {
      id: "card_l1s4l1_02_theory",
      type: "theory",
      order: 2,
      title: "У клиента есть права",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 2",
      ctaLabel: "Понятно, дальше",
      thinkingType: "memory",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Право клиента банка начинается с понятной информации: что за услуга, сколько стоит, какие условия, есть ли дополнительные продукты и как отказаться от лишнего.\n\nЕсли что-то непонятно, нормальный первый шаг — попросить договор, тарифы, письменное пояснение или номер обращения. Это не конфликт, а способ разобраться.\n\nЕсли права нарушены, полезно сначала обратиться в банк через официальный канал и сохранить ответ. Если ответ не устроит, можно использовать Интернет-приемную Банка России; имущественные споры по подходящим требованиям рассматривает финансовый уполномоченный до суда.\n\nЭто образовательный маршрут, а не юридическая консультация по личному спору. В сложной ситуации условия и документы нужно проверять отдельно.",
    },
    {
      id: "card_l1s4l1_03_practice",
      type: "categorization",
      order: 3,
      title: "Право или ловушка?",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 3",
      ctaLabel: "Дальше",
      thinkingType: "application",
      develops: "soft skills",
      checkability: "objective",
      question:
        "Распредели действия: где **право или рабочее действие**, а где миф или рискованный ход.",
      categories: [
        {
          id: "right-action",
          label: "Право или рабочее действие",
        },
        {
          id: "myth-risk",
          label: "Миф или рискованный ход",
        },
      ],
      items: [
        {
          id: "ask-docs",
          label: "Попросить договор, тарифы и время прочитать условия",
          correctCategoryId: "right-action",
          feedback:
            "Клиент может просить понятные условия до согласия.",
        },
        {
          id: "everyone-signs",
          label: "Подписать, потому что «у всех так»",
          correctCategoryId: "myth-risk",
          feedback:
            "Давление фразой «у всех так» не заменяет понятные условия.",
        },
        {
          id: "save-proof",
          label: "Сохранить чек, скриншот, дату и номер обращения",
          correctCategoryId: "right-action",
          feedback:
            "Сохранённые факты помогают описать ситуацию официально.",
        },
        {
          id: "cbr-return-money",
          label: "Ждать, что Банк России сам вернет деньги без документов",
          correctCategoryId: "myth-risk",
          feedback:
            "Официальный канал требует фактов и не обещает автоматический возврат денег.",
        },
        {
          id: "official-bank-request",
          label: "Направить обращение в банк через официальный канал",
          correctCategoryId: "right-action",
          feedback:
            "Это рабочий первый шаг: описать ситуацию и сохранить ответ.",
        },
        {
          id: "delete-chat",
          label: "Удалить переписку, чтобы не нервничать",
          correctCategoryId: "myth-risk",
          feedback:
            "Удаление переписки убирает доказательства и усложняет официальный маршрут.",
        },
      ],
      feedbackTitle: "Хорошая работа",
      feedback:
        "Рабочая защита прав начинается с понятных условий, сохранённых фактов и официального обращения. Мифы обычно обещают быстрый результат без документов или подталкивают согласиться вслепую.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Ищи опору: договор, тарифы, письменный ответ, номер обращения. Всё, что убирает документы или заменяет официальный маршрут эмоциями, слабее защищает клиента.",
    },
    {
      id: "card_l1s4l1_04_real_world",
      type: "scenario",
      order: 4,
      title: "Допуслуга в договоре",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 4",
      ctaLabel: "Собрать памятку",
      thinkingType: "real world A",
      develops: "soft skills",
      checkability: "objective",
      body:
        "Миша оформлял банковскую услугу и позже заметил платную опцию, о которой, как ему кажется, ясно не рассказали. Он хочет разобраться без ссоры и без постов «на эмоциях». Банк России на странице защиты прав потребителей объясняет: для оперативного решения спорной ситуации сначала обращаются в финансовую организацию, а если ответ не устраивает — в Банк России через Интернет-приемную. Для имущественных требований по подходящим спорам есть финансовый уполномоченный.",
      question: "Какой первый шаг лучше всего подходит Мише?",
      options: [
        {
          id: "wrong-delete-app",
          label: "Удалить приложение банка и ждать, что всё исправится само",
          feedback:
            "Ожидание без фактов и обращения не запускает официальный маршрут.",
        },
        {
          id: "correct-bank-request",
          label:
            "Собрать договор, скриншоты и написать обращение в банк через официальный канал",
          isCorrect: true,
          feedback:
            "Это рабочий первый шаг: обращение в банк запускает официальный маршрут и оставляет материалы для следующего обращения, если ответ не устроит.",
        },
        {
          id: "wrong-cbr-first-money",
          label:
            "Сразу требовать у Банка России вернуть деньги, не описывая ситуацию банку",
          feedback:
            "Банк России не заменяет факты и первичное обращение в организацию. Сначала лучше собрать материалы и официальный ответ банка.",
        },
      ],
      correctOptionId: "correct-bank-request",
      feedbackTitle: "Верно",
      feedback:
        "Сначала нужны факты и обращение в банк: продукт, дата, сумма, что именно непонятно, копии документов или скриншоты. Если ответ не устроит, дальше проще обратиться в официальный канал с уже собранными материалами.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Права защищают не только эмоцией, а маршрутом: факты, обращение в банк, сохранённый ответ, затем официальный канал по ситуации.",
      statistics: {
        title: "Статистика по теме",
        items: [
          {
            value: "102,1 тыс.",
            label:
              "жалоб поступило в Банк России за январь-март 2026 года. Это показывает, что обращение по финансовой услуге — обычный официальный канал, а не «стыдный» шаг.",
          },
        ],
        sources: [
          "[Банк России, «Защита прав потребителей финансовых услуг», обновлено 03.07.2026](https://www.cbr.ru/protection_rights/)",
        ],
      },
    },
    {
      id: "card_l1s4l1_05_rights_memo",
      type: "artifact",
      order: 5,
      title: "Памятка прав клиента",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 5",
      ctaLabel: "Сохранить памятку",
      thinkingType: "personal world",
      develops: "soft skills",
      checkability: "mixed",
      body:
        "Собери короткую памятку на случай, если условие банка непонятно или кажется навязанным. Это личный черновик, не юридическая жалоба и не рекомендация спорить в любой ситуации.",
      template: [
        "Ситуация: какой продукт или услуга, дата, где это произошло.",
        "Что хочу понять: цена, комиссия, допуслуга, отказ, срок, условие договора.",
        "Что сохраняю: договор, тарифы, чек, скриншот, переписку, номер обращения.",
        "Первый адрес: официальный канал банка или финансовой организации.",
        "Если ответ не устроит: Интернет-приемная Банка России; по имущественным требованиям проверить возможность обращения к финансовому уполномоченному.",
      ],
    },
    {
      id: "card_l1s4l1_06_reflection",
      type: "reflection",
      order: 6,
      title: "Что мешает спросить?",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 6",
      ctaLabel: "Дальше",
      thinkingType: "personal world",
      develops: "psychology",
      checkability: "subjective",
      prompt:
        "Что тебе обычно мешает спокойно уточнить условия или написать обращение в банк?",
      inputType: "single_select",
      options: [
        "Боюсь выглядеть неудобным клиентом",
        "Не понимаю, какие документы сохранить",
        "Не знаю, куда писать первым",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
      saveKey: "bank_client_rights_barrier",
      guidance:
        "Любой вариант нормален. Права клиента не требуют конфликта: часто достаточно паузы, фактов и короткого официального обращения.",
    },
    {
      id: "card_l1s4l1_07_micro_rule",
      type: "artifact",
      order: 7,
      title: "Моё правило клиента",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 7",
      ctaLabel: "Сделать моим правилом",
      thinkingType: "habit",
      develops: "habits",
      checkability: "mixed",
      body:
        "Выбери одно маленькое правило для Навигатора. Оно не решает личный спор за тебя, но помогает не соглашаться вслепую и не терять доказательства.",
      variants: [
        "Если условие банка непонятно, я прошу договор, тарифы и беру паузу до согласия",
        "Если считаю, что право нарушено, я сохраняю факты и сначала пишу в банк через официальный канал",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
    },
    {
      id: "card_l1s4l1_08_summary",
      type: "summary",
      order: 8,
      title: "Навигатор пополнен",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md / Экран 8",
      thinkingType: "artifact",
      develops: "habits",
      checkability: "subjective",
      body:
        "Готово. У тебя есть памятка прав клиента банка: что уточнить, что сохранить и куда обратиться первым.",
      points: [
        "Клиент имеет право понимать условия финансовой услуги до согласия.",
        "Рабочий маршрут начинается с фактов и обращения в банк, а не с эмоций и догадок.",
        "Если ответ не устроит, следующий шаг выбирают по ситуации: Интернет-приемная Банка России или финансовый уполномоченный для подходящих имущественных требований.",
      ],
      nextStep:
        "Эта памятка пригодится, когда в Разделе 4 будем разбирать финансовую среду и официальные источники подробнее.",
    },
  ],
};

const lesson14 = {
  id: "lesson_l1_s4_l2_reading_key_terms",
  slug: "reading-key-terms",
  title: "Читаем ключевые условия",
  subtitle: "У1.14",
  description:
    "Научиться быстро находить ключевые условия финансовой услуги перед согласием и собрать чек-лист «что проверить».",
  order: 2,
  estimatedMinutes: 5,
  learningGoal:
    "Научиться быстро находить ключевые условия финансовой услуги перед согласием.",
  mainSkill:
    "Софт + харды: внимательное чтение условий и сбор короткого чек-листа",
  tags: ["L1", "financial-environment", "key-terms"],
  sourceSection:
    "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / У1.14 / Паспорт урока",
  cards: [
    {
      id: "card_l1s4l2_01_hook",
      type: "single_choice",
      order: 1,
      title: "Мелкий шрифт перед кнопкой",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 1",
      ctaLabel: "Найти главное в условиях",
      thinkingType: "understanding",
      develops: "psychology",
      checkability: "subjective",
      question:
        "Оформляешь финансовую услугу: карту, вклад, заём, страховку или платный пакет. На экране — длинные условия, а рядом кнопка «Согласен». Вроде бы всё понятно, но читать не хочется.\n\nЧто обычно хочется сделать в такой момент?",
      options: [
        {
          id: "accept-fast",
          label: "Быстро нажать «Согласен», чтобы закончить",
          feedback:
            "Понятная реакция: условия часто выглядят тяжёлыми. В этом уроке сделаем короткий способ не тонуть в тексте.",
        },
        {
          id: "only-price",
          label: "Посмотреть только цену или платёж",
          feedback:
            "Цена важна, но она не одна. Комиссии, срок и допуслуги тоже могут менять итоговую стоимость.",
        },
        {
          id: "ask-manager",
          label: "Спросить менеджера, где главное",
          feedback:
            "Это может помочь, но лучше ещё увидеть условие в документе. Слова и текст договора должны совпадать.",
        },
        {
          id: "open-terms",
          label: "Открыть условия и искать самому",
          feedback:
            "Хорошая база. Сейчас соберём короткий чек-лист, чтобы искать быстрее.",
        },
      ],
    },
    {
      id: "card_l1s4l2_02_theory",
      type: "theory",
      order: 2,
      title: "Шесть строк вместо всего договора",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 2",
      ctaLabel: "Понятно, дальше",
      thinkingType: "memory",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Не нужно запоминать весь договор наизусть. Для первого чтения держи шесть строк: **что оформляю, сколько это стоит, на какой срок, какие проценты и комиссии, какие штрафы и допуслуги, как отказаться или куда обратиться**.\n\nРекламная фраза показывает только часть картины. Итоговую стоимость и обязательства часто меняют срок, комиссия, платная услуга, штраф за просрочку или условие отказа.\n\nЕсли строку нельзя найти или объяснить своими словами, это повод взять паузу и попросить показать условие в документе. Это не юридическая консультация, а базовая финансовая гигиена.",
    },
    {
      id: "card_l1s4l2_03_practice",
      type: "categorization",
      order: 3,
      title: "Разложи условия по блокам",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 3",
      ctaLabel: "Дальше",
      thinkingType: "application",
      develops: "hard skills",
      checkability: "objective",
      question: "Распредели условия по блокам короткого чек-листа.",
      categories: [
        { id: "product", label: "Что оформляю" },
        { id: "money-time", label: "Деньги и сроки" },
        { id: "risk-route", label: "Риски и маршрут" },
      ],
      items: [
        {
          id: "product-name-party",
          label: "Название продукта и кто вторая сторона договора",
          correctCategoryId: "product",
          feedback:
            "Сначала важно понять, что именно оформляется и с кем договор.",
        },
        {
          id: "amount-payment",
          label: "Сумма, цена или размер платежа",
          correctCategoryId: "money-time",
          feedback:
            "Это денежная часть условий: сколько платишь или получаешь.",
        },
        {
          id: "contract-term",
          label: "Срок действия договора или дата платежей",
          correctCategoryId: "money-time",
          feedback: "Срок влияет на обязательства и итоговую стоимость.",
        },
        {
          id: "rate-psk-commissions",
          label: "Ставка, ПСК или комиссии",
          correctCategoryId: "money-time",
          feedback:
            "Ставки, ПСК и комиссии описывают цену услуги или кредита.",
        },
        {
          id: "penalties",
          label: "Штрафы, пени и последствия просрочки",
          correctCategoryId: "risk-route",
          feedback:
            "Это зона риска: что будет, если условие нарушено или платёж задержан.",
        },
        {
          id: "extra-services",
          label: "Дополнительные услуги и проставленные галочки",
          correctCategoryId: "risk-route",
          feedback:
            "Допуслуги могут менять стоимость и обязательства, поэтому их важно увидеть.",
        },
        {
          id: "cancel-route",
          label: "Как отказаться от услуги или расторгнуть договор",
          correctCategoryId: "risk-route",
          feedback:
            "Маршрут отказа нужен до согласия, а не только после спора.",
        },
        {
          id: "complaint-route",
          label: "Куда обращаться с вопросом или жалобой",
          correctCategoryId: "risk-route",
          feedback:
            "Официальный маршрут обращения — часть безопасного чтения условий.",
        },
      ],
      feedbackTitle: "Хорошая работа",
      feedback:
        "Ключевые условия отвечают на три вопроса: что я оформляю, сколько и как долго плачу, где риски и маршрут действий, если что-то пошло не так.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Ищи опору: продукт и стороны — это «что оформляю»; суммы, срок, ставка и комиссии — «деньги и сроки»; штрафы, допуслуги, отказ и жалоба — «риски и маршрут».",
    },
    {
      id: "card_l1s4l2_04_real_world",
      type: "scenario",
      order: 4,
      title: "Перед подписью",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 4",
      ctaLabel: "Собрать свой чек-лист",
      thinkingType: "real world A",
      develops: "soft skills",
      checkability: "objective",
      body:
        "Алина оформляет финансовый продукт. В рекламе видит «выгодные условия», а в документах есть отдельные строки про комиссию, платный пакет услуг, штраф при просрочке и порядок отказа. Банк России отдельно подчёркивает: перед подписанием договора важно прочитать условия осознанно, а навязывание услуг и сокрытие существенной информации — зона защиты прав потребителей финансовых услуг.\n\nИсточники: [защита прав потребителей финансовых услуг](https://www.cbr.ru/protection_rights/) и [сервис Банка России для сообщений о возможных нарушениях](https://www.cbr.ru/press/event/?id=24667).",
      question:
        "Какой первый шаг лучше всего помогает не пропустить важное условие?",
      options: [
        {
          id: "wrong-ad-rate",
          label: "Сравнить только рекламную ставку или первый платёж",
          feedback:
            "Рекламная ставка или первый платёж — только часть условий.",
        },
        {
          id: "correct-checklist",
          label:
            "Заполнить короткий чек-лист: продукт, цена, срок, комиссии, штрафы и допуслуги, отказ или жалоба",
          isCorrect: true,
          feedback:
            "Это самый полезный первый шаг: он переводит длинный текст условий в шесть проверяемых строк.",
        },
        {
          id: "wrong-sign-now",
          label: "Подписать сейчас, а если будет спор — потом разбираться",
          feedback:
            "Жалоба может быть важным маршрутом, но лучше сначала понять документ до подписи.",
        },
      ],
      correctOptionId: "correct-checklist",
      feedbackTitle: "Верно",
      feedback:
        "Чек-лист не решает за человека, оформлять продукт или нет. Он помогает увидеть условия до согласия: что именно покупается, сколько стоит, как долго действует и где маршрут отказа или обращения.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Рекламная ставка или первый платёж — только часть условий. Жалоба может быть важным маршрутом, но лучше сначала понять документ до подписи.",
    },
    {
      id: "card_l1s4l2_05_checklist_artifact",
      type: "artifact",
      order: 5,
      title: "Мой чек-лист условий",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 5",
      ctaLabel: "Сохранить чек-лист",
      thinkingType: "personal world",
      develops: "hard skills",
      checkability: "mixed",
      body:
        "Возьми безопасный пример: будущую карту, вклад, страховку, заём, платный пакет или просто типовой документ без личных данных. Заполни шесть строк, которые стоит проверить перед согласием. Номера карт, пароли и персональные документы сюда не нужны.\n\nЭто образовательный фильтр, а не юридическая консультация и не совет оформить или отказаться от продукта. Если условие спорное, его стоит уточнять в официальном источнике или у специалиста.",
      template: [
        "Продукт и вторая сторона: что именно оформляю и с кем.",
        "Сумма или цена: сколько плачу или получаю.",
        "Срок: когда начинается, заканчивается и когда нужны платежи.",
        "Ставка, ПСК или комиссии: где указана полная стоимость.",
        "Штрафы и дополнительные услуги: что подключено и за что могут начислить плату.",
        "Отказ или жалоба: где написан порядок отмены, обращения или претензии.",
      ],
    },
    {
      id: "card_l1s4l2_06_reflection",
      type: "reflection",
      order: 6,
      title: "Что хочется пропустить?",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 6",
      ctaLabel: "Дальше",
      thinkingType: "personal world",
      develops: "psychology",
      checkability: "subjective",
      prompt:
        "Какая строка условий обычно кажется самой скучной или сложной, хотя может быть важной?",
      inputType: "single_select",
      options: [
        "Комиссии и платные услуги",
        "Штрафы и последствия просрочки",
        "Порядок отказа или жалобы",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
      saveKey: "key_terms_blind_spot",
      guidance:
        "Любой вариант нормален. Цель — заметить свою «слепую зону» и проверять её первой, когда читаешь условия.",
    },
    {
      id: "card_l1s4l2_07_micro_rule",
      type: "artifact",
      order: 7,
      title: "Моё правило чтения условий",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 7",
      ctaLabel: "Сделать моим правилом",
      thinkingType: "habit",
      develops: "habits",
      checkability: "mixed",
      body:
        "Выбери одно маленькое правило для Навигатора. Оно не принимает решение за тебя, а помогает не соглашаться с непонятными условиями автоматически.",
      variants: [
        "Если передо мной финансовые условия, то сначала заполняю шесть строк: продукт, цена, срок, комиссии, штрафы и допуслуги, отказ или жалоба",
        "Если не могу найти важное условие или объяснить его своими словами, то беру паузу и прошу показать эту строку в документе",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
    },
    {
      id: "card_l1s4l2_08_summary",
      type: "summary",
      order: 8,
      title: "Чек-лист готов",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md / Экран 8",
      thinkingType: "artifact",
      develops: "habits",
      checkability: "subjective",
      body:
        "Готово. У тебя есть чек-лист **«что проверить»** перед согласием с финансовой услугой.",
      points: [
        "Шесть строк: продукт, сумма или цена, срок, ставка и комиссии, штрафы и дополнительные услуги, отказ или жалоба.",
        "Правило паузы: если условие не находится или не объясняется своими словами, не соглашаться автоматически.",
      ],
      nextStep:
        "В следующем уроке этот чек-лист пригодится на конкретной теме кредита: будем смотреть не только на рекламную ставку, а на полную стоимость и дополнительные расходы.",
    },
  ],
};

const lesson15 = JSON.parse(
  readFileSync(
    "harness/artifacts/T-173-add-level-1-lessons-10-16/lesson-15/runtime-lesson.json",
    "utf8",
  ),
);

const lesson16 = {
  id: "lesson_l1_s4_l4_where_to_find_current_data",
  slug: "where-to-find-current-data",
  title: "Где брать актуальные данные",
  subtitle: "У1.16",
  description:
    "Научиться выбирать официальный источник для меняющихся финансовых данных и сохранить список проверенных источников.",
  order: 4,
  estimatedMinutes: 5,
  learningGoal:
    "Выбрать подходящий официальный источник для ставки, статистики, налога, страхования вкладов или тарифа продукта и зафиксировать дату проверки.",
  mainSkill:
    "Софт + цифровая среда: выбирать первоисточник, проверять дату и отличать официальные данные от пересказа",
  tags: [
    "L1",
    "financial-environment",
    "official-sources",
    "digital-environment",
  ],
  sourceSection:
    "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / У1.16 / Паспорт урока",
  cards: [
    {
      id: "card_l1s4l4_01_hook",
      type: "single_choice",
      order: 1,
      title: "«А какая цифра сейчас?»",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 1",
      ctaLabel: "Найти первоисточник",
      thinkingType: "understanding",
      develops: "psychology",
      checkability: "subjective",
      question:
        "В чате прислали совет: **«Проверь ставку, лимит или тариф — там всё изменилось»**. В поиске много ответов: статья, пост, реклама, скриншот, официальный сайт.\n\nЧто первым делом хочется сделать?",
      options: [
        {
          id: "first-search-result",
          label: "Взять первую цифру из поиска",
          feedback:
            "Понятная реакция: так быстрее. Но у финансовых данных важны **источник и дата**, иначе можно взять устаревшее число.",
        },
        {
          id: "ask-friends",
          label: "Спросить у знакомых, где они смотрят",
          feedback:
            "Знакомые могут подсказать направление, но их ответ не заменяет первоисточник. Дальше соберём короткую карту источников.",
        },
        {
          id: "official-source",
          label: "Открыть официальный источник и проверить дату",
          feedback:
            "Хороший фокус. Для меняющихся данных важны не память, а маршрут: **где проверить** и **когда обновлено**.",
        },
      ],
    },
    {
      id: "card_l1s4l4_02_theory",
      type: "theory",
      order: 2,
      title: "Не зубри цифру, знай источник",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 2",
      ctaLabel: "Понятно, дальше",
      thinkingType: "memory",
      develops: "hard skills",
      checkability: "objective",
      body:
        "Ставки, лимиты, тарифы, налоговые правила и статистика могут измениться. Поэтому безопаснее запоминать не само число, а путь: **какой источник открыть, где увидеть дату и к какому продукту относится цифра**.\n\nБанк России — ключевая ставка, курсы, реестры и часть показателей финансового рынка. Росстат — официальная статистика, например данные о ценах и инфляции. ФНС и Госуслуги — налоги, вычеты и государственные сервисы. АСВ — страхование вкладов. Официальный договор и тарифы банка — условия конкретного продукта.\n\nПересказ, блог или реклама могут быть полезной подсказкой, но не должны быть последней точкой проверки. Для решения по своей ситуации условия и документы всё равно нужно сверять отдельно.",
    },
    {
      id: "card_l1s4l4_03_practice",
      type: "categorization",
      order: 3,
      title: "Куда идти за цифрой?",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 3",
      ctaLabel: "Дальше",
      thinkingType: "application",
      develops: "soft skills",
      checkability: "objective",
      question:
        "Разложи примеры по трём группам: **официальный источник**, **документ продукта** или **не источник для решения**.",
      categories: [
        { id: "official-source", label: "Официальный источник" },
        { id: "product-document", label: "Документ продукта" },
        { id: "not-decision-source", label: "Не источник для решения" },
      ],
      items: [
        {
          id: "key-rate-cbr",
          label: "Ключевая ставка на сайте Банка России",
          correctCategoryId: "official-source",
          feedback:
            "Это официальный источник для ключевой ставки и ряда показателей финансового рынка.",
        },
        {
          id: "rosstat-prices",
          label: "Официальная статистика цен на сайте Росстата",
          correctCategoryId: "official-source",
          feedback:
            "Росстат публикует официальную статистику; важно смотреть период и дату публикации.",
        },
        {
          id: "tax-deduction-fns",
          label: "Размер налогового вычета в ФНС или на Госуслугах",
          correctCategoryId: "official-source",
          feedback:
            "Для налогов и вычетов нужны государственные сервисы и актуальные правила, а не пересказ.",
        },
        {
          id: "deposit-insurance-asv",
          label: "Условия страхования вкладов на сайте АСВ",
          correctCategoryId: "official-source",
          feedback:
            "АСВ — профильный источник по страхованию вкладов; лимиты и условия нужно проверять на дату обращения.",
        },
        {
          id: "card-commission-tariff",
          label: "Комиссия по конкретной карте в тарифах банка",
          correctCategoryId: "product-document",
          feedback:
            "Условия конкретной карты берут из тарифов, договора или официального сайта банка.",
        },
        {
          id: "bank-cancel-contract",
          label: "Порядок отказа от услуги в договоре банка",
          correctCategoryId: "product-document",
          feedback:
            "Порядок отказа зависит от договора и условий продукта; здесь нужен документ продукта.",
        },
        {
          id: "chat-screenshot",
          label: "Скриншот из чата без даты",
          correctCategoryId: "not-decision-source",
          feedback:
            "Скриншот может быть устаревшим или вырванным из контекста. Его лучше использовать только как повод проверить первоисточник.",
        },
        {
          id: "ad-banner",
          label: "Рекламный баннер с крупной цифрой",
          correctCategoryId: "not-decision-source",
          feedback:
            "Реклама показывает часть условий. Для решения нужны дата, договор, тарифы и ограничения.",
        },
      ],
      feedbackTitle: "Хорошая работа",
      feedback:
        "Для общих показателей и правил нужен официальный государственный источник. Для конкретного продукта — договор, тарифы или официальный сайт организации. Скриншот, реклама и пересказ могут подсказать вопрос, но не закрывают проверку.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Спроси себя: это первоисточник, документ моего продукта или пересказ? Если нет даты, ссылки и привязки к продукту, цифру лучше перепроверить.",
    },
    {
      id: "card_l1s4l4_04_real_world",
      type: "scenario",
      order: 4,
      title: "Три цифры за вечер",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 4",
      ctaLabel: "Собрать список",
      thinkingType: "real world A",
      develops: "soft skills",
      checkability: "objective",
      body:
        "Дане нужно обновить три разные цифры: ключевую ставку для учебного примера, официальные данные по инфляции и комиссию по своей банковской карте. Эти данные живут в разных местах: на сайте [Банка России](https://www.cbr.ru/), на сайте [Росстата](https://rosstat.gov.ru/) и в тарифах или договоре конкретного банка.\n\nДля других тем пригодятся [ФНС России](https://www.nalog.gov.ru/), [Госуслуги](https://www.gosuslugi.ru/) и [АСВ](https://www.asv.org.ru/).",
      question:
        "Какой подход лучше всего помогает Дане не взять устаревшую или чужую цифру?",
      options: [
        {
          id: "wrong-one-article",
          label:
            "Взять все цифры из одной свежей статьи, если она выглядит подробной",
          feedback:
            "Даже свежая статья может пересказывать разные источники, периоды и продукты. Её лучше использовать как подсказку, а не финальную проверку.",
        },
        {
          id: "official-source-date",
          label:
            "Открыть подходящий официальный источник или тариф банка, проверить дату и сохранить ссылку",
          isCorrect: true,
          feedback:
            "Верно. У разных данных разные первоисточники: ведомство, регулятор или документ конкретного продукта. Дата обновления помогает понять актуальность.",
        },
        {
          id: "wrong-search-extreme",
          label:
            "Выбрать самый большой или самый маленький показатель из поисковой выдачи",
          feedback:
            "Поисковая выдача может смешивать старые и новые данные. Самая заметная цифра не обязательно актуальна и относится к нужному продукту.",
        },
      ],
      correctOptionId: "official-source-date",
      feedbackTitle: "Верно",
      feedback:
        "У разных данных разные первоисточники. Общие показатели проверяют у ведомства или регулятора, а условия конкретного продукта — в договоре и тарифах организации. Дата обновления помогает понять, актуальна ли цифра.",
      retryFeedbackTitle: "Проверь ещё раз",
      retryFeedback:
        "Одна статья или поисковая выдача могут смешать разные периоды и продукты. Надёжнее идти к первоисточнику: ведомство, регулятор или документ конкретного продукта.",
    },
    {
      id: "card_l1s4l4_05_source_list",
      type: "artifact",
      order: 5,
      title: "Мой список источников",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 5",
      ctaLabel: "Сохранить список",
      thinkingType: "personal world",
      develops: "soft skills",
      checkability: "mixed",
      body:
        "Собери короткий список, куда будешь возвращаться за меняющимися финансовыми данными. Не нужно вводить пароли, номера карт или личные документы. Достаточно типа данных, источника, даты и ссылки.\n\nЭто образовательная карта источников, а не рекомендация выбрать продукт или принять решение. Если ситуация спорная или личная, условия стоит сверять в документах и при необходимости у специалиста.",
      template: [
        "Что нужно узнать: ставка, тариф, лимит, вычет, статистика или условие договора.",
        "Где проверяю: Банк России, Росстат, ФНС, Госуслуги, АСВ, договор или тариф банка.",
        "Дата проверки: когда источник обновлён или когда я его смотрел(а).",
        "Ссылка или путь: URL, раздел приложения или название документа.",
        "Что перепроверю перед решением: дата, продукт, период, регион, исключения и допусловия.",
      ],
    },
    {
      id: "card_l1s4l4_06_reflection",
      type: "reflection",
      order: 6,
      title: "Где хочется ускориться?",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 6",
      ctaLabel: "Дальше",
      thinkingType: "personal world",
      develops: "psychology",
      checkability: "subjective",
      prompt:
        "Где тебе чаще всего хочется взять финансовую цифру быстро, **не проверяя первоисточник**?",
      inputType: "single_select",
      options: [
        "В поисковой выдаче или статье без даты",
        "В чате, коротком видео или скриншоте",
        "На официальном сайте, но без проверки даты",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
      saveKey: "official_sources_shortcut_barrier",
      guidance:
        "Любой вариант нормален. Цель не в том, чтобы искать идеально каждый раз, а в том, чтобы замечать моменты, где цифра может устареть или относиться не к твоему случаю.",
    },
    {
      id: "card_l1s4l4_07_micro_rule",
      type: "artifact",
      order: 7,
      title: "Моё правило актуальности",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 7",
      ctaLabel: "Сделать моим правилом",
      thinkingType: "habit",
      develops: "habits",
      checkability: "mixed",
      body:
        "Выбери одно маленькое правило для Навигатора. Оно не решает за тебя, что делать с деньгами, а помогает не опираться на устаревшую или чужую цифру.",
      variants: [
        "Если вижу ставку, лимит или тариф, то ищу первоисточник и дату обновления перед тем, как использовать цифру",
        "Если цифра относится к конкретному продукту, то сверяю её в договоре или тарифах банка, а не в рекламе",
      ],
      customOption: {
        label: "Свой вариант",
        placeholder: "Напиши свой вариант",
      },
    },
    {
      id: "card_l1s4l4_08_summary",
      type: "summary",
      order: 8,
      title: "Раздел 4 завершён",
      sourceSection:
        "docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md / Экран 8",
      thinkingType: "artifact",
      develops: "habits",
      checkability: "subjective",
      body:
        "Готово. У тебя есть **список официальных источников** для меняющихся финансовых данных.",
      points: [
        "Для общих финансовых показателей — Банк России или Росстат.",
        "Для налогов, вычетов и госуслуг — ФНС и Госуслуги.",
        "Для страхования вкладов — АСВ.",
        "Для конкретного продукта — официальный договор, тарифы и сайт банка или финансовой организации.",
        "Главная привычка: проверять источник, дату и привязку к продукту.",
      ],
      nextStep:
        "Этот список пригодится в следующих уроках и уровнях, где будут встречаться ставки, лимиты, вычеты, тарифы и статистика. Когда цифра меняется, у тебя уже есть маршрут проверки.",
    },
  ],
};

const section3 = JSON.parse(readFileSync(section3Path, "utf8"));
section3.description =
  "Раздел помогает увидеть связь риска и доходности, сопоставлять риск со сроком, учитывать инфляцию и проверять финансовые предложения по официальным источникам.";
section3.lessons = [
  section3.lessons.find(
    (lesson) =>
      lesson.id === "lesson_l1_s3_l1_thirty_percent_without_risk_red_flag",
  ),
  lesson10,
  lesson11,
  lesson12,
];

const section4 = {
  schemaVersion: 1,
  id: "section_l1_s4_financial_environment",
  slug: "financial-environment",
  title: "Раздел 4. Финансовая среда",
  description:
    "Раздел помогает понимать права клиента банка, читать ключевые условия, оценивать кредит через ПСК и находить актуальные финансовые данные в официальных источниках.",
  order: 4,
  source: "docs/levels/level-1-start/sections/financial-environment/",
  lessons: [lesson13, lesson14, lesson15, lesson16],
};

const level = JSON.parse(readFileSync(levelPath, "utf8"));
const section4Ref = {
  id: section4.id,
  slug: section4.slug,
  title: section4.title,
  description: section4.description,
  order: section4.order,
  path: "sections/section_04_financial_environment.json",
};
level.sections = [
  ...level.sections.filter((section) => section.id !== section4.id),
  section4Ref,
].sort((a, b) => a.order - b.order);

writeFileSync(section3Path, `${JSON.stringify(section3, null, 2)}\n`);
writeFileSync(section4Path, `${JSON.stringify(section4, null, 2)}\n`);
writeFileSync(levelPath, `${JSON.stringify(level, null, 2)}\n`);
