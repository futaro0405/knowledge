## 自己評価
40/100
## 勉強時間
22h
## 良かったこと
- 遅くても23時就寝、6時起床のサイクルができた
- 朝起きてジムに行く習慣ができた
- 睡眠の質をよくするために取り組めた
- Obsidianで日報の作業を簡略化できたこと
## 悪かったこと
- 平日の勉強時間が思ったより取れなかったこと
## 改善すること(ネクストアクション)
- 効率的に学習する方法を模索する
- 勉強時間を確保するライフサイクルを確立する
## 質問・相談など(もしあれば)
- 今週は特になし
## 感想・来週の目標
- 来週は時間を見つけて30時間は確保したい
- 下書きの記事が増えてきたので投稿する

```dataview
table
date, study, score
from "2024/01-January"
where file.day >= date("2024-01-07")
　AND file.day <= date("2024-01-13")
```

```dataviewjs
const pages = dv.pages('"2024/01-January"').filter(p => p.file.name > "2024-01-06" && p.file.name < "2024-01-14").sort(p => p.file.name);

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
        label: 'Mark',
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
        label: 'Mark',
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
