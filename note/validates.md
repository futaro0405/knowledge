## validates

| validate                                         | helper                                                               |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| 必須データがはいっているか                       | validates :foo, presence: true                                       |
| 数値が期待通りか                                 | validates :foo, numaricality: true                                   |
| 数値範囲が期待通りか                             | validates :foo, inclusion: { in: 0..9 }                              |
| 文字列の長さが想定通りか                         | validates :foo, length :{ maxinum: 30 }                              |
| 文字列fomat、構成文字種                          | validates :foo, format: {with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i} |
| 一意か                                           | validates :foo, uniqueness: true                                     |
| パスワード、メールアドレスが確認と一致しているか | validates :foo, confirmation: true                                   |

