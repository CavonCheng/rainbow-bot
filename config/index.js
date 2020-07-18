const config = {
    // jwt 
    secret: 'myrainbow',
    user: {
        id: 1,
        username: 'bigboss',
        password: '123456'
    },

    // 可远程发消息的群，空表示无
    sendRooms: [
        '测试',
        '测试2',
        '测试3',
        '测试4',
        '内测'
    ],

    // 可响应消息的群，空表示所有
    respRooms: [],

    // 超级管理员
    commanders: [
        '大boss'
    ]

}

module.exports = config