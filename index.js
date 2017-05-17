var board = {
    // chessmanList: {
    //     '车':'ju'
    //     '马':'ma'
    //     '象':'xiang'
    //     '士':'shi'
    //     '':'jiang'
    //     '':'pao'
    //     '':'zu'
    // },
    numberList: {
        '一': 1,
        '二': 2,
        '三': 3,
        '四': 4,
        '五': 5,
        '六': 6,
        '七': 7,
        '八': 8,
        '九': 9
    },
    convertNumber: function (n) {
        var num = parseInt(n)
        if (isNaN(num)) num = this.numberList[n]
        if (num === undefined || num > 9) {
            console.log('请输入正确的步进数！')
            return
        }
        return num
    },
    resetChess: function () {
        $('.chessman').remove()
        $('.chess').append('\
            <i class="chessman ju" location="1-1"></i>\
            <i class="chessman ma" location="2-1"></i>\
            <i class="chessman xiang" location="3-1"></i>\
            <i class="chessman shi" location="4-1"></i>\
            <i class="chessman jiang" location="5-1"></i>\
            <i class="chessman shi" location="6-1"></i>\
            <i class="chessman xiang" location="7-1"></i>\
            <i class="chessman ma" location="8-1"></i>\
            <i class="chessman ju" location="9-1"></i>\
            <i class="chessman pao" location="2-3"></i>\
            <i class="chessman pao" location="8-3"></i>\
            <i class="chessman zu" location="1-4"></i>\
            <i class="chessman zu" location="3-4"></i>\
            <i class="chessman zu" location="5-4"></i>\
            <i class="chessman zu" location="7-4"></i>\
            <i class="chessman zu" location="9-4"></i>')
        $('.chess').eq(0).find('.chessman').addClass('black')
        $('.chess').eq(1).find('.chessman').addClass('red')
    },
    moveChessman: function (player, code) {
        var targetClass = '',
            location = ''
        //判断棋子名
        switch (code[0]) {
            case '车':
            case '車':
                targetClass = 'che'
                break
            case '马':
            case '馬':
                targetClass = 'ma'
                break
            case '象':
            case '相':
                targetClass = 'xiang'
                break
            case '士':
            case '仕':
                targetClass = 'shi'
                break
            case '将':
            case '帥':
                targetClass = 'jiang'
                break
            case '炮':
            case '砲':
                targetClass = 'pao'
                break
            case '卒':
            case '兵':
                targetClass = 'zu'
                break
            default:
                console.log('似乎输入了错误的棋子名称，请重试')
                return
        }
        //结合执子方及位置选中具体棋子
        //象棋行棋步骤参考 https://zhidao.baidu.com/question/3673556.html
        //需要注意的是：目前未判断棋子在同一竖线上的情况
        //2017年5月17日16:00:38
        var $chessman = $('.' + targetClass + '.' + player)
        $chessman.each(function () {
            if (board.convertNumber($(this).attr('location')[0]) == board.convertNumber(code[1])) {
                $chessman = $(this);
                return false
            } else {
                $chessman = undefined
            }
        })
        //未找到排错
        if ($chessman === undefined) {
            console.log('未找到' + code[0] + code[1]+"，请检查！")
            return
        }
        $chessman.removeClass('red black')
        //判断落子点132133
        
    }
}
/**
 * 等差计算
 * start:number 起始位置
 * val:number 步进值
 * pos:number 步进数
 */
board.gradeCalculat = function (start, val, pos) {
    return (start * 100 + val * 100 * (pos - 1)) / 100
}
$(function () {
    //创建棋盘
    $('.chess').prepend(function () {
        var html = ''
        for (var i = 0; i < 8 * 4; i++) {
            html += function (index) {
                switch (index) {
                    case 8:
                        return '<div class="block mark-rb"></div>'
                    case 9:
                        return '<div class="block mark-lb"></div>'
                    case 16:
                        return '<div class="block mark-rt"></div>'
                    case 17:
                        return '<div class="block mark-lt"></div>'
                    case 14:
                        return '<div class="block mark-rb"></div>'
                    case 15:
                        return '<div class="block mark-lb"></div>'
                    case 22:
                        return '<div class="block mark-rt"></div>'
                    case 23:
                        return '<div class="block mark-lt"></div>'
                    default:
                        return '<div class="block"></div>'
                }
            }(i)
        }
        return html
    });
    //添加棋子样式
    $('head').append(
        function () {
            var single = ''
            for (var x = 1; x <= 9; x++) {
                for (var y = 1; y <= 5; y++) {
                    single += '.chessman[location=\'' + x + '-' + y + '\']{left:' + board.gradeCalculat(-4, 12.3, x) + '%;top:' + board.gradeCalculat(-8, 25, y) + '%}'
                }
            }
            return $('<style><style>').html(single)
        }
    )
    //添加棋子
    board.resetChess()
    //
    $('#go').on('click', function () {
        board.moveChessman($(":checked").val(), $.trim($('#code').val()))
    })
})