var request = require('request'); 
var testJandi = function () { 
    var formData = { 
        body: '[TEST][금방금방] 고객 문의가 접수되었습니다.', //Body text (Required) 
        connectColor: '#FAC11B', //Hex code color of attachment bar 
        connectInfo: [
            { 
                title: '고객정보', //2nd attachment area title 
                description: 'id:aaa@aaa.com, 이름:홍길동' //2nd attachment description
            },
            { 
                title: '언제 입금되나요?', //1st attachment area title 
                description: '오늘 입금신청했는데, 언제 입금되나요?', //1st attachment description
                imageUrl: 'https://금방금방.kr/images/logo.png' //Image URL 
            }
        ] 
    } 
    var options = { 
        url: 'https://wh.jandi.com/connect-api/webhook/20798930/fc512d04cdd0fb76b59329ee54f76e06', 
        headers: { 
            "Content-type": "application/json", 
            "Accept": "application/vnd.tosslab.jandi-v2+json" 
        }, 
        form: formData 
    }; 
    request.post(options, function (err, response, body) { 
        if (err) { 
            console.error('err: ', err); 
            return; 
        } 
        console.log('body: ', body); 
        return; 
    }); 
}; 
testJandi();
