
exports.formatDate = function(date, friendly) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    if (friendly) {
        var now = new Date();
        var msseconds = -(date.getTime() - now.getTime());
        var timeStamp = [1000, 1000*60, 1000*60*60, 1000*60*60*24];
        if (msseconds < timeStamp[3]) {
            if (msseconds > 0 && msseconds < timeStamp[1]) {
                return Math.floor(msseconds/timeStamp[0]) + ' 秒前';
            }
            if (msseconds > timeStamp[1] && msseconds < timeStamp[2]) {
                return Math.floor(msseconds/timeStamp[1]) + ' 分钟前';
            }
            if (msseconds > timeStamp[2] && msseconds < timeStamp[3]) {
                return Math.floor(msseconds/timeStamp[2]) + ' 小时前';
            }
        }
        var thisyear = new Date().getFullYear();
        var year = (thisyear === year) ? '' : year;
        if (year !== '') {
            return year + ' 年 ' + (month+1) + ' 月 ' + (day+1) + ' 日 ' + hour + ':' + minutes;
        } else {
            return (month+1) + ' 月 ' + (day+1) + ' 日 ' + hour + ':' + minutes;
        }

    }
}