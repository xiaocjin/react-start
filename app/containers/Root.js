/**
 * Created by jinxc on 16/3/21.
 */
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./Root.prod');
} else {
    module.exports = require('./Root.dev');
}