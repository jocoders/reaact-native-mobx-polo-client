import { action, observable, runInAction } from 'mobx'

class DataStore {
  @observable data = null
  @observable error = false
  @observable fetchInterval = null
  @observable loading = false

  //*Make request to API
  @action.bound
  fetchInitData() {
    const response = fetch('https://poloniex.com/public?command=returnTicker')
    return response
  }

  //*Parse data from API
  @action.bound
  jsonData(data) {
    const res = data.json()
    return res
  }

  //*Get objects key and push it to every object
  @action.bound
  mapObjects(obj) {
    const res = Object.keys(obj).map(key => {
      let newData = obj[key]
      newData.key = key
      return newData
    })
    return res
  }

  //*Main bound function that wrap all fetch flow function
  @action.bound
  async fetchData() {
    try {
      runInAction(() => {
        this.error = false
        this.loading = true
      })
      const response = await this.fetchInitData()
      const json = await this.jsonData(response)
      const map = await this.mapObjects(json)
      const run = await runInAction(() => {
        this.loading = false
        this.data = map
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.loading = false
        this.error = err
      })
    }
  }

  //*Call reset of MobX state
  @action.bound
  resetState() {
    runInAction(() => {
      this.data = null
      this.fetchInterval = null
      this.error = false
      this.loading = true
    })
  }

  //*Call main fetch function with repeat every 5 seconds
  //*when the component is mounting
  @action.bound
  initInterval() {
    if (!this.fetchInterval) {
      this.fetchData()
      this.fetchInterval = setInterval(() => this.fetchData(), 5000)
    }
  }

  //*Call reset time interval & state
  //*when the component is unmounting
  @action.bound
  resetInterval() {
    if (this.fetchInterval) {
      clearTimeout(this.fetchInterval)
      this.resetState()
    }
  }
}

const store = new DataStore()
export default store
