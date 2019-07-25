const request = require("request")
const exec = require('child_process').exec;

function common(url, body) {
  var promise = new Promise((r, j) => {
    request.post({ url: url, body: body }, (e, resp) => {
      if (e) {
        j();
      } {
        try {
          r(JSON.parse(resp.body));
        } catch (e) {
          j();
        } finally {
        }
      }
    });
  });
  promise.catch(new Function);
  return promise;
}

function rsa(body) {
  var promise = new Promise((r, j) => {
    exec(`java -jar rsa.jar ${body}`, function (error, stdout, stderr) {
      if (!error) {
        r(stdout)
      } else {
        j(stderr)
      }
    });
  })
  return promise
}

async function starttask(user_id, open_id, task) {
  var body = await rsa(`{\\"openid\\":\\"${open_id}\\",\\"cash\\":\\"100\\",\\"goldnum\\":\\"${task.goldnum}\\",\\"infoid\\":\\"0\\",\\"status\\":\\"0\\",\\"taskid\\":\\"${task.id}\\",\\"user_id\\":\\"${user_id}\\"}`)
  var data = await common("http://ytx.wk2.com/api/v1.welfare/addusertask", body)
  return data
}

async function endtask(user_id, open_id, task, infoid) {
  var body = await rsa(`{\\"openid\\":\\"${open_id}\\",\\"cash\\":\\"100\\",\\"goldnum\\":\\"${task.goldnum}\\",\\"infoid\\":\\"${infoid}\\",\\"status\\":\\"1\\",\\"taskid\\":\\"${task.id}\\",\\"user_id\\":\\"${user_id}\\"}`)
  var data = await common("http://ytx.wk2.com/api/v1.welfare/addusertask", body)
  return data
}

async function sign(user_id, open_id) {
  var body = await rsa(`{\\"openid\\":\\"${open_id}\\",\\"cash\\":\\"0.0\\",\\"user_id\\":\\"${user_id}\\"}`)
  var data = await common("http://ytx.wk2.com/api/v1.welfare/addusersign", body)
  return data
}

async function dotask(user_id, open_id, task) {
  var data = await starttask(user_id, open_id, task)
  if (data && data.code == 1) {
    console.dir("创建任务成功->" + JSON.stringify(data))
    data = await endtask(user_id, open_id, task, data.data.infoid)
    if (data && data.code == 1) {
      console.dir("完成任务->" + JSON.stringify(data))
    }
  } else {
    console.dir("创建任务失败->" + JSON.stringify(data))
  }
}

async function main(user_id, open_id) {
  var data = await sign(user_id, open_id)
  if (data && data.code == 1) {
    console.log("签到成功->" + JSON.stringify(data))
  } else {
    console.log("签到失败->" + JSON.stringify(data))
  }
  data = await common("http://ytx.wk2.com/api/v1.welfare/gettaskinfo", "")
  if (data && data.code == 1) {
    for (var i = 0; i < data.data.length; i++) {
      var task = data.data[i];
      if (task.title.indexOf('签到') == -1) {
        await dotask(user_id, open_id, task)
      }
    }
    task = { "goldnum": "0", "id": "11" }
    await dotask(user_id, open_id, task)
  }
}




main("1098632", "ONH0TT4KRTBJA_MRVNROU1FZS3QW")