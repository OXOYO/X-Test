<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  render () {
    return <div>{ this.msg }</div>
  }
}
</script>
