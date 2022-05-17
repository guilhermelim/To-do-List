
const Main = {

    tasks: [],

    init: function () {
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    cacheSelectors: function () {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$buttonTask = document.querySelector('.buttonTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    bindEvents: function () {
        const self = this

        this.$checkButtons.forEach(function (button) {
            button.onclick = self.Events.checkButton_click.bind(self)
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)
        this.$buttonTask.onclick = self.Events.buttonTask_click.bind(this)

        this.$removeButtons.forEach(function (button) {
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    getStoraged: function () {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
            this.tasks = JSON.parse(tasks)
        } else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    getTaskHtml: function (task, isDone, taskId) {
        return `
        <li class="${isDone ? 'done' : ''}" data-task="${task}" data-taskid="${taskId}">          
          <div class="check" ></div>
          <label class="task">
            ${task}
          </label>
          <button class="remove"></button>
        </li>
      `
    },

    insertHTML: function (element, htmlString) {
        element.innerHTML += htmlString

        this.cacheSelectors()
        this.bindEvents()
    },

    buildTasks: function () {
        let html = ''

        this.tasks.forEach((item, id) => {
            html += this.getTaskHtml(item.task, item.done, id)
            // console.log(`${id} ${item.task}`)
        })

        this.insertHTML(this.$list, html)
    },

    Events: {
        checkButton_click: function (e) {
            const li = e.target.parentElement
            const value = li.dataset['task']
            const isDone = li.classList.contains('done')

            const newTasksState = this.tasks.map(item => {
                if (item.task === value) {
                    item.done = !isDone
                }

                return item
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            if (!isDone) {
                return li.classList.add('done')
            }

            li.classList.remove('done')
        },

        inputTask_keypress: function (e) {
            const key = e.key
            const value = e.target.value
            const isDone = false

            if (key === 'Enter' && value !== '') {
                const taskHtml = this.getTaskHtml(value, isDone)

                this.insertHTML(this.$list, taskHtml)

                e.target.value = ''

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksArr = JSON.parse(savedTasks)

                const arrTasks = [
                    { task: value, done: isDone },
                    ...savedTasksArr,
                ]

                const jsonTasks = JSON.stringify(arrTasks)

                this.tasks = arrTasks
                localStorage.setItem('tasks', jsonTasks)
            }
        },

        buttonTask_click: function (e) {
            console.log(this.tasks)

            const value = this.$inputTask.value
            const isDone = false

            if (value !== '') {
                const taskHtml = this.getTaskHtml(value, isDone)

                this.insertHTML(this.$list, taskHtml)

                this.$inputTask.value = ''

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksArr = JSON.parse(savedTasks)

                const arrTasks = [
                    { task: value, done: isDone },
                    ...savedTasksArr,
                ]

                const jsonTasks = JSON.stringify(arrTasks)

                this.tasks = arrTasks
                localStorage.setItem('tasks', jsonTasks)
            }

        },

        removeButton_click: function (e) {
            const li = e.target.parentElement
            const value = li.dataset['task']

            console.log(this.tasks)

            const newTasksState = this.tasks.filter(item => {
                console.log(item.task, value)
                return item.task !== value
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))
            this.tasks = newTasksState

            li.classList.add('removed')

            setTimeout(function () {
                li.classList.add('hidden')
            }, 300)
        }
    }

}

Main.init()