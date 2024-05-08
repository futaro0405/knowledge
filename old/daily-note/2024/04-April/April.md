## April
### statistics

```dataview
table
sum(rows.study) as "total(study)",
length(rows) as "count(day)",
round(sum(rows.study) / length(rows), 0) as "avg(study)"
from "daily-note/2024/04-April"
GROUP BY date(date).year + "-" + date(date).month + "-" + date(date).week + "th" as date
WHERE rows.date
```

```dataviewjs
const pages = dv.
pages('"daily-note/2024/04-April"').
filter(p => p.file.name > "2024-04-00" && p.file.name < "2024-04-32").
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

function barChart(terms, data1, data2) {
  return {
    type: 'bar',
    data: {
      labels: terms,
      datasets: [{
        label: 'tranings',
        data: data1,
        borderColor: ['rgba(99, 132, 255, 1)'],
        backgroundColor: ['rgba(99, 132, 255, 0.7)']
      },{
        label: 'sleeps',
        data: data2,
        borderColor: ['rgba(255, 99, 132, 1)'],
        backgroundColor: ['rgba(255, 99, 132, 0.7)']
      }]
    }
  }
}

const dailyScore = studyChart(days, studies)
const dailyBar = barChart(days, tranings, sleeps)

window.renderChart(dailyScore, this.container)
window.renderChart(dailyBar, this.container)
```
