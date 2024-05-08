## 自己評価
/100
## 勉強時間
00 h
## 良かったこと
- xxxxx
## 悪かったこと
- xxxxx
## 改善すること(ネクストアクション)
- xxxxx
## 質問・相談など(もしあれば)
- xxxxx
## 感想・来週の目標
- xxxxx


```dataview
table
date, study, score
from "2024/01-January"
where file.day >= date("{{Date:YYYY-MM-DD}}")
　AND file.day <= date("{{Date:YYYY-MM-DD}}")
```

```dataview
table
sum(rows.study) as total,
length(rows) as count,
round(sum(rows.study) / length(rows), 0) as avg
from "2024/01-January"
GROUP BY date(date).year + "-" + date(date).month + "-" + date(date).week as date
WHERE rows.date
```

```dataviewjs
const pages = dv.pages('"2024/01-January"').filter(p => p.file.name > "{{Date:YYYY-MM-DD}}" && p.file.name < "{{Date:YYYY-MM-DD}}").sort(p => p.file.name);

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
