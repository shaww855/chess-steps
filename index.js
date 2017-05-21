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
        '九': 9,
        '１': 1,
        '２': 2,
        '３': 3,
        '４': 4,
        '５': 5,
        '６': 6,
        '７': 7,
        '８': 8,
        '９': 9
    },
    convertNumber: function (n) {
        var num = parseInt(n)
        if (isNaN(num)) num = this.numberList[n]
        if (num === undefined || num > 9) {
            console.info('请输入正确的步进数！')
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
    showText: function (t) {
        clearTimeout(this.timeId)
        $('#textinfo').text(t).slideDown()
        this.timeId = setTimeout(function () {
            $('#textinfo').slideUp()
        }, 3000)
    },
    eatOrNot: function (x, y) {
        var el = $('.chessman[location=' + x + '-' + y + ']')
        console.info('目的地', el)
        if (el.length == 0) {
            this.showText('目的地无棋子，允许移动')
            return true
        }
        if (el.hasClass(this.player)) {
            this.showText('目的地有己方棋子，禁止移动')
            return false
        }
        el.remove()
        return true
    },
    moveChessman: function (code) {
        var targetClass,
            targetName,
            targetNum,
            afertLocation = { x: 0, y: 0 },
            beforeLocation = { x: 0, y: 0 }
        //判断是否同一纵向上
        switch (code[0]) {
            case '前':
                targetName = code[1]
                targetNum = 0
                break
            case '后':
                targetName = code[1]
                targetNum = 1
                break
            default:
                targetName = code[0]
        }
        //判断棋子名
        switch (targetName) {
            case '车':
            case '車':
                targetClass = 'ju'
                break
            case '马':
            case '馬':
                targetClass = 'ma'
                addY = 2
                break
            case '象':
            case '相':
                targetClass = 'xiang'
                addY = 3
                break
            case '士':
            case '仕':
                targetClass = 'shi'
                addY = 1
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
                this.showText('似乎输入了错误的棋子名称，请重试')
                return
        }
        //结合执子方及位置选中具体棋子
        //象棋行棋步骤参考 https://zhidao.baidu.com/question/3673556.html
        //2017年5月17日16:00:38
        //象棋规则参考 http://www.xqbase.com/protocol/rule.htm
        var $chessman = $('.' + targetClass + '.' + this.player)
        console.log('.' + targetClass + '.' + this.player)
        //判断两个棋子是否在同一竖线
        if (targetNum !== undefined) {
            var max = parseInt($chessman.eq(0).attr('location')[2]),
                min = parseInt($chessman.eq(1).attr('location')[2]),
                x = $chessman.eq(0).attr('location')[0]
            if (max > min) {
                $chessman = $('.' + this.player + '[location=' + x + '-' + (targetNum == 0 ? max : min) + ']')
            } else {
                $chessman = $('.' + this.player + '[location=' + x + '-' + (targetNum == 0 ? min : max) + ']')
            }
        } else {
            $chessman.each(function (index, domEl) {
                //以用户输入的横坐标判断
                if (board.convertNumber($(this).attr('location').split('-')[0]) == board.convertNumber(code[1])) {
                    $chessman = $(this)
                    return false
                } else {
                    $chessman = undefined
                }
            })
        }
        //未找到排错
        if ($chessman === undefined) {
            this.showText('未找到' + code[0] + code[1] + "，请检查！")
            return
        }
        console.info('准备移动', code[0] + code[1])
        // $chessman.removeClass('red black')
        //计算落子点坐标
        beforeLocation = {
            x: parseInt($chessman.attr('location').split('-')[0]),
            y: parseInt($chessman.attr('location').split('-')[1])
        }
        console.info('移动前坐标', beforeLocation)
        //未判断马象士
        var codeMove = this.convertNumber(code[3])
        switch (targetClass) {
            case 'ma':
                switch (code[2]) {
                    case '平':
                        //马无平
                        this.showText('马无平')
                        break
                    case '进':
                        //判断差值，x+2则y+1，x+1则y+2,x-2则y+1，x-1则y+2
                        afertLocation.x = codeMove
                        if ((codeMove - beforeLocation.x) == 2 || (beforeLocation.x - codeMove) == 2) {
                            afertLocation.y = beforeLocation.y + 1
                        } else if ((codeMove - beforeLocation.x) == 1 || (beforeLocation.x - codeMove) == 1) {
                            afertLocation.y = beforeLocation.y + 2
                        } else {
                            this.showText('请注意，马走“日”')
                            return
                        }
                        break
                    case '退':
                        //判断差值，x+2则y+1，x+1则y+2,x-2则y+1，x-1则y+2
                        afertLocation.x = codeMove
                        if ((codeMove - beforeLocation.x) == 2 || (beforeLocation.x - codeMove) == 2) {
                            afertLocation.y = beforeLocation.y - 1
                        } else if ((codeMove - beforeLocation.x) == 1 || (beforeLocation.x - codeMove) == 1) {
                            afertLocation.y = beforeLocation.y - 2
                        } else {
                            this.showText('请注意，马走“日”')
                            return
                        }
                        break
                    default:
                        this.showText('输入了奇怪的语句：' + code[2])
                }
                break
            case 'xiang':
                switch (code[2]) {
                    case '平':
                        this.showText(code[0] + '无平')
                        break
                    case '进':
                        afertLocation = {
                            x: codeMove,
                            y: beforeLocation.y + 2
                        }
                        break
                    case '退':
                        afertLocation = {
                            x: codeMove,
                            y: beforeLocation.y - 2
                        }
                        break
                    default:
                }
                break
            case 'shi':
                switch (code[2]) {
                    case '平':
                        this.showText(code[0] + '无平')
                        break
                    case '进':
                        afertLocation = {
                            x: codeMove,
                            y: beforeLocation.y + 1
                        }
                        break
                    case '退':
                        afertLocation = {
                            x: codeMove,
                            y: beforeLocation.y - 1
                        }
                        break
                    default:
                }
                break
            default:
                switch (code[2]) {
                    //平：Y不变，直接改X
                    case '平':
                        afertLocation.x = codeMove
                        afertLocation.y = beforeLocation.y
                        break
                    //进/退：X不变，加/减Y
                    case '进':
                        afertLocation.x = beforeLocation.x
                        afertLocation.y = (parseInt(beforeLocation.y) + codeMove)
                        break
                    case '退':
                        afertLocation.x = beforeLocation.x
                        afertLocation.y = (parseInt(beforeLocation.y) - codeMove)
                        break
                    default:
                        this.showText('走法只能为进、退、平，请检查')
                        return
                }
        }
        console.info('移动后坐标', afertLocation)

        /**
         * 判断移动后坐标是否超出棋盘
         */
        if (afertLocation.x > 9 || afertLocation.y > 10) {
            this.showText('落子点超出棋谱，请检查！')
            return
        }
        //判断落子点是否存在棋子
        var $targetChessman = $('.chessman[location=' + afertLocation.x + '-' + afertLocation.y + ']')
        if ($targetChessman.length > 0) {
            console.info('落子点存在棋子');
            if ($targetChessman.hasClass(this.player)) {
                this.showText('自己人')
                return false
            }
        }
        //因棋谱是翻转建立的，需转换坐标判断对方棋子
        $targetChessman = $('.chessman[location=' + (10 - afertLocation.x) + '-' + (11 - afertLocation.y) + ']').not('.' + this.player)
        $targetChessman.remove()
        $chessman.attr('location', afertLocation.x + '-' + afertLocation.y)
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
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        return '<div class="block mark-num"></div>'
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
                for (var y = 1; y <= 10; y++) {
                    single += '.chessman[location=\'' + x + '-' + y + '\']{left:' + board.gradeCalculat(-4, 12.3, x) + '%;top:' + board.gradeCalculat(-8, 24.5, y) + '%}'
                }
            }
            return $('<style><style>').html(single)
        }
    )
    //添加棋子
    board.resetChess()
    $('#reset').click(function () {
        if (confirm('确认复位棋盘？')) board.resetChess()
    })
    //
    $('#go').click(function () {
        $('#codes a').each(function () {
            board.player = $(".player:checked").val()
            if ($(this).hasClass('disabled')) return
            $(this).addClass('active').prevAll('.active').removeClass('active')
            board.moveChessman($(this).text())
            $(".player:checked").parent().siblings().click();
        })
        // $.trim($('#code').val()).split(/\n/)
    })
    var codeChangeTimeId
    $('#code').on('input', function () {
        clearTimeout(codeChangeTimeId)
        codeChangeTimeId = setTimeout(function () {
            $('#codes').empty().append(function () {
                var html = '', round = 0
                $('#code').val().split(/\n/).forEach(function (element, index, array) {
                    if (index % 2 == 0) html += '<a href="javascript:;" class="list-group-item disabled">第 ' + (++round) + ' 回合</a>'
                    if ($.trim(element) == '' || element.length != 4)
                        html += '<a href="javascript:;" class="list-group-item" data-index="error">棋谱有误，错误内容（' + element + '）</a>'
                    else
                        html += '<a href="javascript:;" class="list-group-item" data-index="' + index + '">' + element + '</a>'
                })
                return html
            })
        }, 500);
    })
})