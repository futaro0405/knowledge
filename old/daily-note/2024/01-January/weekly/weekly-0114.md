## 自己評価
50/100
## 勉強時間
29h
## 良かったこと
- 先週に引き続き、朝ジムに行くルーティーンを続けたこと
- Obsidianを使ってknowledgeのまとめ方を工夫できたこと
- 平日の勉強時間を先週よりも確保できたこと
- 工夫して勉強中にスマホを触らないようにできたこと
## 悪かったこと
- 勉強時間の確保のため、睡眠の時間を削ってしまったこと
## 改善すること(ネクストアクション)
- times、twitterをもっと活用する
## 質問・相談など(もしあれば)
- 特になし
## 感想・来週の目標
- スマホのスクリーンタイムを抑えれるようになってきたので来週は平均1時間未満を目指したい

```dataview
table
date, study, score
from "2024/01-January"
where file.day >= date("2024-01-13")
　AND file.day <= date("2024-01-19")
```

```dataview
table
sum(rows.study) as totalTime,
length(rows) as count,
round(sum(rows.study) / length(rows), 0) as avgTime,
round(sum(rows.score) / length(rows), 0) as avgScore
from "2024/01-January"
GROUP BY date(date).week as week
WHERE rows.date
```



```dataviewjs
const pages = dv.pages('"2024/01-January"').filter(p => p.file.name > "2024-01-12" && p.file.name < "2024-01-20").sort(p => p.file.name);

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
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],  
        borderColor: ['rgba(255, 99, 132, 1)'],  
        borderWidth: 2,
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
        backgroundColor: ['rgba(99, 132, 255, 0.2)'],
        borderColor: ['rgba(99, 132, 255, 1)'],
        borderWidth: 2,
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
