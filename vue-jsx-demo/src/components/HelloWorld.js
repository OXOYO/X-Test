export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      title: 'Test 001'
    }
  },
  render () {
    return <div>
      <h1>{ this.title }</h1>
      { this.msg }
    </div>
  }
}
