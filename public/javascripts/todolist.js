getList();

function getList() {
    $.get("http://localhost:3000/api/getList", function(data, status) {
        for (let i = 0; i < data.length; i++) {
            newList(data[i])
        }
    });
}

function newList(data) {
    // 使用 status 做為判斷條件, 判斷待辦事項是否完成, 若完成改變標題與內容的 CSS.
    var status = (data.status) ? "checked" : "";
    var titleClass = (data.status) ? "title2" : "title";
    var messageClass = (data.status) ? "message2" : "message";

    // 使用 status 做為判斷條件, 判斷事項若完成則隱藏修改按鈕.
    var editClass = (data.status) ? "none" : "inline";

    // 將下方 html 儲存到 content 變數中
    var content = `
    <div class="content" id="${data._id}">
        <div class="${titleClass}">
            <input type="checkbox" onclick="changeStatus('${data._id}', this)"/>
            <text id="title${data._id}">${data.title}</text>
            <button class="i_btn" onclick="removeList('${data._id}')">刪除</button>
            <button class="i_btn" id="edit${data._id}" style="display: ${editClass}" onclick="editList('${data._id}')">修改</button>
            <button class="i_btn" id="update${data._id}" style="display: none" onclick="updateList('${data._id}')">確認</button>
        </div>
        <div class="${messageClass}">
            <text id="message${data._id}">${data.content}</text>
        </div>
    </div>
    `;

    // 將 content 變數使用 append() 方法加入 body 中
    $('body').append(content);
}

function addList() {
    var _title = $('#title').val();
    var _message = $('#message').val();

    if (_title == "" || _message == "") {
        alert("請輸入標題和內容");
    } else {
        $.post("http://localhost:3000/api/addList", {
            'title': _title,
            'content': _message
        }, (res) => {
            newList(res.data);
            $('#title').val('');
            $('#message').val('');
        });
    };
};

function editList(id) {
    // 隱藏 edit 按鈕, 顯示確認修改按鈕
    $('#edit' + id).css("display", "none");
    $('#update' + id).css("display", "inline");

    // 建立 input 元素, 供修改標題之用, input type 為 text, 編輯標題ID, value 為 title + id 的內容, 最後為輸入框大小
    var input = document.createElement('input');
    input.type = "text";
    input.id = "edit_title" + id;
    input.value = $('#title' + id).text();
    input.size = Math.max(20 / 4 * 3, 4);

    // 隱藏 title
    $('#title' + id).css("display", "none");
    // 在標題的父層插入新建立的輸入框
    $('#title' + id).parent().append(input);

    // 建立 input, 供修改內容之用, 大致與上分修改標題相同.
    var message_input = document.createElement('input')
    message_input.type = "text";
    message_input.id = "edit_message" + id;
    message_input.value = $('#message' + id).text()
    message_input.size = Math.max(50 / 4 * 3, 4);

    $('#message' + id).css("display", "none");
    $('#message' + id).parent().append(message_input);
}

function updateList(id) {
    let title = $('#edit_title' + id).val();
    let message = $('#edit_message' + id).val();

    $.post("http://localhost:3000/api/updateList", {
        'id': id,
        'title': title,
        'content': message
    }, (res) => {
        if (res.status == 0) {
            $('#title' + id).text(title);
            $('#message' + id).text(message);
            $('#edit' + id).css("display", "inline");
            $('#update' + id).css("display", "none");
            $('#title' + id).css("display", "inline");
            $('#message' + id).css("display", "inline");
            $('#edit_title' + id).remove();
            $('#edit_message' + id).remove();
        }
    })
}

function removeList(id) {
    $.post("http://localhost:3000/api/removeList", {
        "id": id
    }, (res) => {
        if (res.status == 0) {
            $('#' + id).remove()
        }
    })
}

function changeStatus(id, btnstatus) {
    var title = btnstatus.parentNode;
    var message = title.nextElementSibling;

    $.post("http://localhost:3000/api/changeStatus", {
        "id": id,
        'status': btnstatus.checked
    }, (res) => {
        if (res.status == 0) {
            title.className = "title2";
            message.className = "message2";
            $('#edit' + id).css("display", "none");
            $('#update' + id).css("display", "none");

            if (document.getElementById("edit_title" + id)) {
                $('#title' + id).css("display", "inline");
                $('#message' + id).css("display", "inline");
                $('#edit_title' + id).remove();
                $('#edit_message' + id).remove();
            }
        } else {
            title.className = "title";
            message.className = "message";
        }
    })
}