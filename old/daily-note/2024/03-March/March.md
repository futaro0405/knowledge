## Febuary
### statistics

```dataview
table
sum(rows.study) as "total(study)",
length(rows) as "count(day)",
round(sum(rows.study) / length(rows), 0) as "avg(study)"
from "daily-note/2024/03-March"
GROUP BY date(date).year + "-" + date(date).month + "-" + date(date).week + "th" as date
WHERE rows.date
```

```dataviewjs
const pages = dv.
pages('"daily-note/2024/03-March"').
filter(p => p.file.name > "2024-03-00" && p.file.name < "2024-03-32").
sort(p => p.file.name);

function extract(pages, key) {
  return pages.map(p => p[key]).values
}

const days = pages.map(p => p.file.name).values  
const tranings =  extract(pages, 'traning')
const sleeps =  extract(pages, 'sleep')
const studies = extract(pages, 'study')

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

function barChart(terms, tranings, sleeps) {
  return {
    type: 'bar',
    data: {
      labels: terms,
      datasets: [{
        label: 'tranings',
        data: tranings,
        borderColor: ['rgba(99, 132, 255, 1)'],
        backgroundColor: ['rgba(99, 132, 255, 0.7)']
      },{
        label: 'sleeps',
        data: sleeps,
        borderColor: ['rgba(255, 99, 132, 1)'],
        backgroundColor: ['rgba(255, 99, 132, 0.7)']
      }]
    }
  }
}

const dailyScore = scoreChart(days, totals)
const dailyBar = barChart(days, tranings, sleeps)

window.renderChart(dailyScore, this.container)
window.renderChart(dailyBar, this.container)
```


## 1st
### 自己評価
65/100
### 勉強時間
15 h
### 良かったこと
- ジャーナリングを1週間続けたこと
- ミートアップ参加後のやる気を1週間持ち続けたこと
### 悪かったこと
- 東京遠征の疲労を引きづったこと
- 睡眠時間が遅くなったこと
### 改善すること(ネクストアクション)
- 早寝早起きの生活に戻す
### 質問・相談など(もしあれば)
- なし
### 感想・来週の目標 
ずっと悩んでいたrailsのEC課題がようやく終わりが見えてきた。
今週からtwitter課題にも手を付ける。

## 2nd
### 自己評価
50/100  
### 勉強時間
20 h  
### 良かったこと
- ジャーナルを続けることができたこと
- EC課題が完了したこと
- twitter cloneに取り組めたこと

### 悪かったこと
- 少し食生活が乱れたこと
- 少し日報のつけ方、勉強の仕方が雑になってきた

### 改善すること(ネクストアクション)
- ジャーナルノートを引き続きづづけてみる
- ノートのとり方を工夫する

### 質問・相談など(もしあれば)
- 特になし

### 感想・来週の目標
- 時間の使い方を見直す

## 3rd
### 自己評価
60/100
### 勉強時間
25 h
### 良かったこと
- 先週よりも勉強時間が取れたこと
- 生活習慣を改善するための取り組みができたこと
### 悪かったこと
- 食生活が乱れたこと
- ジムに行く頻度が落ちたこと
### 改善すること(ネクストアクション)
- 早起きしてタスクをこなし、夜は早々に寝る習慣に戻す
### 質問・相談など(もしあれば)
- なし
### 感想・来週の目標 
仕事の繁忙期が落ち着き、勉強時間を増やせそう。
理想の生活習慣を回しながら勉強時間を延ばせるように頑張る。