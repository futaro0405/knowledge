## 自己評価
30/100
## 勉強時間
14 h
## 良かったこと
- 英語の勉強を始められたこと
- どれだけ忙しくても最低1時間は勉強できたこと
## 悪かったこと
- 生活サイクルを回すためにやるべきことを後回しにしたこと
## 改善すること(ネクストアクション)
- 忙しいときでも勉強できるように朝活に勉強時間を入れる
## 質問・相談など(もしあれば)
- なし
## 感想・来週の目標
- 今週は仕事が忙しくなってしまい思ったように勉強時間が取れなかった。忙しいときこそ勉強時間が確保できるように生活サイクルを工夫したい。


```dataview
table
date, study, score
from "daily-note/2024/01-January"
where file.day >= date("2024-01-01")
　AND file.day <= date("2024-01-31")
sort file.day asc
```

```dataview
table
sum(rows.study) as total,
length(rows) as count,
round(sum(rows.study) / length(rows), 0) as avg
from "daily-note/2024/01-January"
GROUP BY date(date).year + "-" + date(date).month + "-" + date(date).week as date
WHERE rows.date
```

```dataviewjs
const pages = dv.pages('"daily-note/2024/01-January"').filter(p => p.file.name > "2024-01-00" && p.file.name < "2024-01-32").sort(p => p.file.name);

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
