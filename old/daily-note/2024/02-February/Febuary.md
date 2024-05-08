## Febuary
### statistics

```dataview
table
date, study, score
from "daily-note/2024/02-February"
where file.day >= date("2024-02-01")
　AND file.day <= date("2024-02-29")
sort file.day asc
```

```dataview
table
sum(rows.study) as total,
length(rows) as count,
round(sum(rows.study) / length(rows), 0) as avg
from "daily-note/2024/02-February"
GROUP BY date(date).year + "-" + date(date).month + "-" + date(date).week as date
WHERE rows.date
```

```dataviewjs
const pages = dv.pages('"daily-note/2024/02-February"').filter(p => p.file.name > "2024-02-00" && p.file.name < "2024-02-32").sort(p => p.file.name);

function extract(pages, key) {
  return pages.map(p => p[key]).values
}

const days = pages.map(p => p.file.name).values  
const scores =  extract(pages, 'score')
const studies = extract(pages, 'study')

function scoreChart(terms, data) {
  return {
    type: 'line',
    options: {
	    width: '100%',
		scales: {
			y: {
				beginAtZero: true
			}
		}
	},
    data: {
      labels: terms,
      datasets: [{
        label: 'score',
        data: data,
        backgroundColor: ['rgba(255, 99, 132, 0.1)'],  
        borderColor: ['rgba(255, 99, 132, 1)'],  
        borderWidth: 1,
        tension: 0.2,
		fill: true,
      }]
    }
  }
}

function studyChart(terms, data) {
  return {
    type: 'line',
    options: {
	    width: '100%',
		scales: {
			y: {
				beginAtZero: true
			}
		}
	},
    data: {
      labels: terms,
      datasets: [{
        label: 'time',
        data: data,
        backgroundColor: ['rgba(99, 132, 255, 0.1)'],  
        borderColor: ['rgba(99, 132, 255, 1)'],  
        borderWidth: 1,
		tension: 0.2,
		fill: true,
      }]
    }
  }
}

function barChart(terms, scores, studies) {
  return {
    type: 'bar',
    data: {
      labels: terms,
      datasets: [{
        label: 'scores',
        data: scores,
        borderColor: ['rgba(99, 132, 255, 1)'],
        backgroundColor: ['rgba(99, 132, 255, 0.7)']
      },{
        label: 'studies',
        data: studies,
        borderColor: ['rgba(255, 99, 132, 1)'],
        backgroundColor: ['rgba(255, 99, 132, 0.7)']
      }]
    }
  }
}

const dailyScore = scoreChart(days, scores)
const dailyStudy = studyChart(days, studies)

window.renderChart(dailyScore, this.container)
window.renderChart(dailyStudy, this.container)
```


## 1st
### 自己評価
30/100
### 勉強時間
14 h
### 良かったこと
- 英語の勉強を始められたこと
- どれだけ忙しくても最低1時間は勉強できたこと
### 悪かったこと
- 生活サイクルを回すためにやるべきことを後回しにしたこと
### 改善すること(ネクストアクション)
- 忙しいときでも勉強できるように朝活に勉強時間を入れる
### 質問・相談など(もしあれば)
- なし
### 感想・来週の目標
- 今週は仕事が忙しくなってしまい思ったように勉強時間が取れなかった。忙しいときこそ勉強時間が確保できるように生活サイクルを工夫したい。

## 2nd
### 自己評価
50/100
### 勉強時間
24 h
### 良かったこと
- RailsのEC課題を進めれたこと
- 食事に気をつけて生活できたこと
	- 1食分をサラダボウルに変える
- 朝のルーティンの運動量を増やせたこと
- 雑談部屋に顔を出せたこと
- 朝活で勉強時間を伸ばせたこと
### 悪かったこと
- 週初めに先週の仕事の忙しさを引きずって体調を崩したこと
### 改善すること(ネクストアクション)
- 朝の時間を有効活用する生活サイクルを継続すること
### 質問・相談など(もしあれば)
- 特になし
### 感想・来週の目標
- 今週は食生活の改善ができたのでこのまま続けたい。

## 3rd
### 自己評価
40/100
### 勉強時間
30 h
### 良かったこと
- 雑談部屋に顔を出せたこと
	- 技術的な会話にも臆せず突っ込むことができたこと
	- 分からないことは分からないということができたこと
- 時間がない日も勉強時間と運動時間を確保できたこと
### 悪かったこと
- 就寝時間のサイクルが崩れたこと
- 英語の勉強時間が先週より少ないこと
### 改善すること(ネクストアクション)
- 生活サイクルを元に戻す
### 質問・相談など(もしあれば)
- 特になし
### 感想・来週の目標
- 3月1日のミートアップまでの2週間で体脂肪をどこまで落とせるかやってみようと思う。

## 4th
### 自己評価
40/100
### 勉強時間
21 h
### 良かったこと
- 天気が悪い日が続いているが部屋に引きこもらずに活動できたこと
- 英語の勉強に力を入れたこと
### 悪かったこと
- 先週より勉強時間が少し落ちた
- あまり勉強に集中できていない
- 筋トレの強度を高めすぎて疲労感が抜けない
### 改善すること(ネクストアクション)
- 筋トレのメニューを見直す
- 勉強の仕方を見直す
### 質問・相談など(もしあれば)
- 特になし
### 感想・来週の目標
- 体脂肪率が思ったよりも落ちなかったので食事面・運動面を改善する

## 5th
### 自己評価
00/100
### 勉強時間
00 h
### 良かったこと
- text text text
### 悪かったこと
- text text text
### 改善すること(ネクストアクション)
- text text text
### 質問・相談など(もしあれば)
- text text text
### 感想・来週の目標
- text text text
