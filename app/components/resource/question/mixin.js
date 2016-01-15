/**
 * Created by Administrator on 2015/10/15.
 */
var Util = {};

Util.QuestionMixin = {
  onDegreeChange: function (e) {
    $("[name='degree']").val(e.target.value);
  },
  addOption: function () {
    var items = this.state.items;
    items.push({id: items.length + 1, checked: false, content: ''});
    this.setState({items: items});
  },
  delOption: function () {
    var items = this.state.items;
    items.pop();
    this.setState({items: items});
  },
  handleChange: function (i, value) {
    var items = this.state.items;
    let { query } = this.props.location;
    var type = Number.parseInt(query.type);
    if (type === 1) {
      if (value) {
        for (var j in items) {
          console.log(j, i - 1);
          if (Number.parseInt(j) === i - 1) {
            items[j].checked = value;
          } else {
            items[j].checked = false;
          }
        }
      }
    } else if (type === 2) {
      items[i - 1].checked = value;
    } else {
      if (i) {
        items[0].checked = true;
        items[1].checked = false;
      } else {
        items[0].checked = false;
        items[1].checked = true;
      }
    }
    this.setState({items: items});
  }
};

module.exports = Util;
