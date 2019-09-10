$(document).ready(function () {
    let newArrayHtml = $('.hide-this').html();
    let statusObj = $('.status div:first-child()');
    let autoCompute = true;
    let padResult = true;
    let padMask = true;
    let padStyle1 = true;
    let padStyle2 = true;

    $('.title button').click(function () {
        $('.put-array-here').prepend(newArrayHtml);
        FixArrayNumbers();
    });

    $(document).on('click', '.btn-del', function () {
        $(this).parents('.array').remove();
        FixArrayNumbers();
    });

    $(document).on('click', '.btn-copy', function () {
        let inputBox = $($(this).parents('div')[1]).find('input:not([type=checkbox])');
        inputBox.focus();
        inputBox.select();
        document.execCommand('copy');
        $(this).focus();

        setStatus('Copied...! - ' + inputBox.val().trim());
    });

    $(document).on('click', '.status input', function () {
        autoCompute = $(this).prop('checked');
    });

    $(document).on('click', '.status button, .put-array-here input[type=checkbox]', function () {
        calculateResult();
    });

    $(document).on('keyup', '.put-array-here input:not([type=checkbox])', function () {
        if (autoCompute)
            calculateResult();
    });

    $('.result input[type=checkbox]').click(function () {
        padResult = $(this).prop('checked');
        if (autoCompute)
            calculateResult();
    });

    $('.mask input[type=checkbox]').click(function () {
        padMask = $(this).prop('checked');
        if (autoCompute)
            calculateResult();
    });

    $('.style1 input[type=checkbox]').click(function () {
        padStyle1 = $(this).prop('checked');
        if (autoCompute)
            calculateResult();
    });

    $('.style2 input[type=checkbox]').click(function () {
        padStyle2 = $(this).prop('checked');
        if (autoCompute)
            calculateResult();
    });

    /// ------------------------- functions --------------------------------

    function calculateResult(b_exactMatch) {
        let result = '';
        let mask = '';
        let allArrays = $('.put-array-here .array input[checked]');
        let arrays = [];
        $.each(allArrays, (i, o) => {
            if ($(o).prop('checked')) {
                let input = $(o).parents('.array').find('input:not([type=checkbox])').val().toString();
                if (input.length > 0)
                    arrays.push(input.toLowerCase());
            }
        });

        if (arrays.length > 0) {
            let minimumLength = 0;
            if (!b_exactMatch) {
                arrays = arrays.map(i => i.trim().replace(/ /g, ''));
            }
            minimumLength = Math.min(...arrays.map(i => i.length > 0 ? i.length : 999));

            for (let i = 0; i < minimumLength; i++) {
                let chars = arrays.map(ch => ch.charAt(i));
                if (chars.length > 0) {
                    if (chars.filter(k => k === chars[0]).length === arrays.length) {
                        result += chars[0];
                        mask += 'x'
                    } else {
                        result += '?';
                        mask += '?';
                    }
                }
            }
        }

        $('.result input:not([type=checkbox])').val(createBytePairs(result.toUpperCase(), padResult ? ' ' : ''));
        $('.mask input:not([type=checkbox])').val(createBytePairs(mask.toUpperCase(), padMask ? ' ' : ''));
        $('.style1 input:not([type=checkbox])').val(createBytePairs(result.toUpperCase(), '', padStyle1 ? '\\x' : ''));
        $('.style2 input:not([type=checkbox])').val(createBytePairs(result.toUpperCase(), padStyle2 ? ', ' : '', padStyle2 ? '0x' : ''));
    }

    function setStatus(status) {
        statusObj.html(status);
        setTimeout(() => {
            if (statusObj.html().trim() === status.trim())
                statusObj.html('');
        }, 3000);
    }

    function FixArrayNumbers() {
        let arrays = $('.put-array-here .array').toArray().reverse();
        for (let i = 1; i <= arrays.length; i++) {
            $(arrays[i - 1]).find('div:first-child()').html('Array ' + padString(i, 3) + ' :');
        }
    }

    function padString(s_text, n_chars) {
        s_text = s_text.toString();
        while (s_text.length < n_chars) {
            s_text = '0' + s_text;
        }
        return s_text;
    }

    function createBytePairs(text, suffChar = '', prefChar = '') {
        let counter = 0;
        let finalText = prefChar;
        while (counter < text.length) {
            if (text.length > counter) {
                finalText += text.charAt(counter);
                counter++;
            }
            if (counter % 2 === 0)
                finalText += suffChar + prefChar;
        }
        if (prefChar.length > 0 && text.length % 2 === 0) {
            finalText = finalText.substr(0, finalText.length - (suffChar + prefChar).length);
        }
        return finalText;
    }

});
