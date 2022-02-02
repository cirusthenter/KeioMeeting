<template>
  <div class="body">
    <div
      class="room-box"
      style="background-color: white;border: 0.5px solid #566469"
    >
      <div class="room-box--session">
        <span class="room-box--shortname"> この予約システムについて </span>
        <div class="room-box--detail">
          <div class="room-box--dept">
            <h4 class="room-box--speaker">
              <ul>
                <li>
                  本予約システムでは、リアル窮理図解の追加聴講予約と追加募集に関する予約状況の確認ができます。なお、1次募集の予約状況の確認・変更はできません。
                </li>
                <li>
                  各回ごとに、講演内容の説明とステータス表示があります。ステータス表示には現時点での予約者数と予約数の上限、および「参加できます」「満席です」などと表示されます。
                </li>
                <li>
                  予約の締切りは講演開催日の当日の午前0時です。講演開催日当日になると予約を行うことはできません。なお、予約の取り消しは可能です。
                </li>
                <li>
                  本システムでは各自、同時に最大2件の講演を予約しておくことができます。予約した講演の開催日の18時をすぎると、すでに開催が終了した予約分は自動的にクリアされ、再度翌日以降の別の講演を予約することができます。
                </li>
              </ul>
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="remain--text--wrapper">
      <h2 class="remain--text">
        現在の予約登録数：{{ numSessions }}/{{ MAX_TO_JOIN }}
      </h2>
    </div>
    <div v-for="(session, index) in sessions" v-bind:key="index">
      <div v-if="!session.isDone" class="room-box">
        <div class="room-box--session">
          <span class="room-box--shortname"> 第{{ session.id }}回 </span>
          <span style="float: right;"
            >{{ session.date }} {{ session.term }}限
          </span>
          <div class="room-box--detail">
            <div class="room-box--dept">
              <h3 class="room-box--shortname">
                {{ session.dept1 }}
              </h3>

              <h4 class="room-box--speaker">
                {{ session.title1 }}
              </h4>
              <h4 class="room-box--name">
                {{ session.description1 }}
              </h4>
              <h3 class="room-box--speaker" style="text-align: right;">
                {{ session.speaker1 }}
              </h3>
            </div>
            <div class="room-box--dept">
              <h3 class="room-box--shortname">
                {{ session.dept2 }}
              </h3>

              <h4 class="room-box--speaker">
                {{ session.title2 }}
              </h4>
              <h4 class="room-box--name">
                {{ session.description2 }}
              </h4>
              <h3 class="room-box--speaker" style="text-align: right;">
                {{ session.speaker2 }}
              </h3>
            </div>
          </div>
        </div>
        <div class="room-box--bottom" @click="show(session)">
          <div v-if="numSessions >= MAX_TO_JOIN">
            <div
              v-if="sessionsToJoin.includes(session.id)"
              class="room-box--participants--reserve"
            >
              参加予定です ({{ session.reserved }}/{{ session.seats }})
            </div>
            <div
              v-else-if="session.reserved >= session.seats"
              class="room-box--participants--red"
              style="opacity: 0.3"
            >
              満席です ({{ session.reserved }}/{{ session.seats }})
            </div>
            <div
              v-else-if="session.digitalDate == getDate()"
              class="room-box--participants--red"
              style="opacity: 0.3"
            >
              本日開催のため予約を締め切りました ({{ session.reserved }}/{{
                session.seats
              }})
            </div>
            <div v-else class="room-box--participants" style="opacity: 0.3">
              参加できます ({{ session.reserved }}/{{ session.seats }})
            </div>
          </div>
          <div v-else>
            <div
              v-if="sessionsToJoin.includes(session.id)"
              class="room-box--participants--reserve"
            >
              参加予定です ({{ session.reserved }}/{{ session.seats }})
            </div>
            <div
              v-else-if="session.reserved >= session.seats"
              class="room-box--participants--red"
            >
              満席です ({{ session.reserved }}/{{ session.seats }})
            </div>
            <div
              v-else-if="session.digitalDate == getDate()"
              class="room-box--participants--red"
            >
              本日開催のため予約を締め切りました ({{ session.reserved }}/{{
                session.seats
              }})
            </div>
            <div v-else class="room-box--participants">
              参加できます ({{ session.reserved }}/{{ session.seats }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "mainPage",
  data() {
    return {
      sessions: [],
      sessionsToJoin: [],
      sessionId: null,
      numSessions: 0,
      date: null,
      term: null,
      dept1: null,
      dept2: null,
      speaker1: null,
      speaker2: null,
      seats: 0,
      reserved: 0,
      MAX_TO_JOIN: 2,
      dateAndTime: null,
    };
  },
  mounted: function() {
    const db = firebase.firestore();
    const userName = firebase.auth().currentUser.displayName;
    const userEmail = firebase.auth().currentUser.email;
    const studentsRef = db.collection("students").doc(userEmail);
    const timeAndDate = this.getTime();
    console.log("timeAndDate: ", timeAndDate);
    db.collection("sessions")
      .get()
      .then(snapshot => {
        //ドキュメントの数だけ「doc」に入れていく
        snapshot.forEach(doc => {
          this.sessions.push(doc.data());
        });
      });
    studentsRef
      .get()
      .then(doc => {
        if (doc.exists) {
          this.sessionsToJoin = doc.data().sessionsToJoin;
          this.numSessions = doc.data().numSessions;
        } else {
          // ここに来たのはそのユーザーが初めてサインインしたケース
          // stuents にそのユーザを追加する
          studentsRef
            .set({
              name: userName,
              email: userEmail,
              numSessions: 0,
              sessionsToJoin: [],
              numJoined: 0,
              registeredAt: timeAndDate,
            })
            .then(function() {
              console.log("Document successfully written!");
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  },
  computed: {},
  methods: {
    join: function() {
      const db = firebase.firestore();
      const userEmail = firebase.auth().currentUser.email;
      const userName = firebase.auth().currentUser.displayName;
      const fieldValue = firebase.firestore.FieldValue;
      const increment = fieldValue.increment(1);
      const sessionRef = db.collection("sessions").doc(this.sessionId);
      const sessionStudentRef = sessionRef
        .collection("students")
        .doc(userEmail);
      const studentRef = db.collection("students").doc(userEmail);
      this.getTime();

      sessionRef
        .get()
        .then(doc => {
          // 登録の直前にその回が満席になっていたら登録できないようにする（非同期処理）
          if (doc.data().seats <= doc.data().reserved) {
            this.reload();
          }
          // 登録が日をまたぎ、当日になっていたら登録できないようにする
          if (doc.data().digitalDate == this.getDate()) {
            this.reload();
          }
          // 登録が2日をまたぎ、その回のの翌日になっていたら登録できないようにする
          // すこぶるレアケース
          if (doc.data().isDone) {
            this.reload();
          }
          // なぜかそのユーザがすでに登録済みなら弾く
          sessionStudentRef
            .get()
            .then(doc => {
              if (doc.exists) {
                this.reload();
              }
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
          // 非同期処理を if の中で行なう仕様（安全策）
          // ネスト深くせざるを得ないと判断
          studentRef
            .get()
            .then(doc => {
              if (doc.data().numSessions >= this.MAX_TO_JOIN) {
                // 一人あたりの上限に達しているときは登録させない
                this.reload();
                return;
              }
              if (doc.data().sessionsToJoin.includes(this.sessionId)) {
                // なぜかもうすでにその回に登録済だったら登録させない
                this.reload();
                return;
              }
              // ここまで来たらユーザーはその回に登録できるってことになる
              // session 内の students サブコレクションにそのユーザを追加
              sessionStudentRef
                .set({
                  name: userName,
                  email: userEmail,
                  reservedAt: this.dateAndTime,
                })
                .then()
                .catch(function(error) {
                  console.error("Error writing document: ", error);
                });
              // その session の参加人数 (reserved) をインクリメント
              sessionRef.update({ reserved: increment });
              // students 内の sessionsToJoin 配列にその回を追加
              studentRef.update({
                sessionsToJoin: fieldValue.arrayUnion(this.sessionId),
              });
              // その student の参加予定回数 (numSessions) をインクリメント
              studentRef.update({ numSessions: increment });
              studentRef.update({ numJoined: increment });
              // log に記録しリロード
              studentRef
                .collection("log")
                .doc(this.dateAndTime + " " + "reserved" + " " + this.sessionId)
                .set({
                  sessionId: this.sessionId,
                  action: "reserve",
                  dateAndTime: this.dateAndTime,
                })
                .then(() => {
                  this.$router.go({
                    path: this.$router.currentRoute.path,
                    force: true,
                  });
                })
                .catch(function(error) {
                  console.error("Error writing document: ", error);
                });
              this.$modal.hide("hello-world");
            })
            .catch(function(error) {
              console.log("Error getting document:", error);
            });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },
    reload: function() {
      this.$router.go({
        path: this.$router.currentRoute.path,
        force: true,
      });
    },
    cancel: function() {
      const db = firebase.firestore();
      const userEmail = firebase.auth().currentUser.email;
      const fieldValue = firebase.firestore.FieldValue;
      const decrement = fieldValue.increment(-1);
      const sessionRef = db.collection("sessions").doc(this.sessionId);
      const sessionStudentRef = sessionRef
        .collection("students")
        .doc(userEmail);
      const studentRef = db.collection("students").doc(userEmail);

      studentRef
        .get()
        .then(doc => {
          // 予約取り消しをしようとしている回がなぜかすでに取り消されていたら、リロードする
          if (!doc.data().sessionsToJoin.includes(this.sessionId)) {
            this.reload();
            return;
          }
          // ここまで来たらユーザーはその回の登録を取り消す正当性があるってことになる
          // session 内の students サブコレクションからそのユーザを削除
          sessionStudentRef
            .delete()
            .then()
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
          // その session の参加人数 (reserved) をデクリメント
          sessionRef.update({ reserved: decrement });
          // students 内の sessionsToJoin 配列からその回を削除
          studentRef.update({
            sessionsToJoin: fieldValue.arrayRemove(this.sessionId),
          });
          // その student の参加予定回数 (numSessions) をデクリメント
          studentRef.update({ numSessions: decrement });
          studentRef.update({ numJoined: decrement });
          // log に記録しリロード
          this.getTime();
          studentRef
            .collection("log")
            .doc(this.dateAndTime + " " + "canceled" + " " + this.sessionId)
            .set({
              email: userEmail,
              sessionId: this.sessionId,
              action: "deleted",
            })
            .then(() => {
              this.$router.go({
                path: this.$router.currentRoute.path,
                force: true,
              });
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },
    getDate: function() {
      var now = new Date();
      var res =
        "" +
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : "" + (now.getMonth() + 1)) +
        "-" +
        (now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate());
      return res;
    },
    getTime: function() {
      var now = new Date();
      var res =
        "" +
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : "" + (now.getMonth() + 1)) +
        "-" +
        (now.getDate() < 10 ? "0" + now.getDate() : "" + now.getDate()) +
        " " +
        (now.getHours() < 10 ? "0" + now.getHours() : "" + now.getHours()) +
        ":" +
        (now.getMinutes() < 10
          ? "0" + now.getMinutes()
          : "" + now.getMinutes()) +
        ":" +
        (now.getSeconds() < 10
          ? "0" + now.getSeconds()
          : "" + now.getSeconds());
      this.dateAndTime = res;
      return res;
    },
    show: function(session) {
      this.dept = session.dept;
      this.sessionId = session.id;
      this.seats = session.seats;
      this.reserved = session.reserved;
      this.dept1 = session.dept1;
      this.dept2 = session.dept2;
      this.date = session.date;
      this.term = session.term;
      this.speaker1 = session.speaker1;
      this.speaker2 = session.speaker2;
      this.isDone = session.isDone;
      this.digitalDate = session.digitalDate;
      var message;
      if (this.sessionsToJoin.includes(this.sessionId)) {
        // ユーザーはこの回に参加予定
        if (this.digitalDate == this.getDate()) {
          // これ取り消したら登録し直せないけど OK ?
          message =
            "第" +
            this.sessionId +
            "回の登録を取り消します。本日開催のため再登録はできませんが、よろしいですか？";
          if (confirm(message)) this.cancel();
        } else {
          // 取り消しても登録し直せるんで気軽にやってください
          message =
            "第" + this.sessionId + "回の登録を取り消します。よろしいですか？";
          if (confirm(message)) this.cancel();
        }
      } else if (this.reserved >= this.seats) {
        // ユーザーは参加予定ではないがこの回は満席であり参加できない
        message = "この回は満席です。";
        alert(message);
      } else if (this.digitalDate == this.getDate()) {
        // ユーザーは参加予定ではないがこの回は本日開催のため予約はもうできない
        message =
          "本日開催のため予約を締め切りました。会場での実際の人数によっては飛び入り参加できる可能性があります。";
        alert(message);
      } else if (this.numSessions >= this.MAX_TO_JOIN) {
        // 登録数の上限に達している
        message =
          "登録数の上限を超えています。登録済みのものを取り消してください。";
        alert(message);
      } else {
        // ユーザーはこの回に登録できる
        message =
          "第" + this.sessionId + "回を参加登録します。よろしいですか？";
        if (confirm(message)) this.join();
      }
    },
    register: function() {
      const db = firebase.firestore();
      const userEmail = firebase.auth().currentUser.email;

      // Add a second document with a generated ID.
      db.collection("users")
        .doc(userEmail)
        .set({
          email: userEmail,
          faculty: this.faculty,
          year: this.year,
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    },
  },
};
</script>

<style lang="scss">
.body {
  max-width: 1300px;
  margin: 0 auto;
}
.remain--text--wrapper {
  width: 90%;
  margin-top: 20px;
  margin-left: 5%;
  text-align: right;
}
.remain--text {
  font-size: 20px;
}
.room-box {
  display: block;
  margin: 20px;
  width: 90%;
  margin-left: 5%;
  position: relative;
  padding: 20px 15px;
  -webkit-transition: background-color 100ms;
  transition: background-color 100ms;
  border-radius: 2px;
  background-color: #f0f2f5;
  color: #1f3333;
  overflow: hidden;
}
.room-box--session {
  padding-bottom: 20px;
}
.room-box--detail {
  font-size: 20px;
  font-family: ten-mincho-text, serif;
  font-weight: 900;
  font-style: normal;
  line-height: 28px;
  margin-bottom: 4px;
}
.room-box--dept {
  border-top: 0.5px solid #566469;
  padding: 7px;
  padding-bottom: 0;
  margin: 5px;
}
.room-box--buttonLabel {
  font-size: 14pt;
  font-weight: normal;
  line-height: 24px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 29px;
  margin: auto;
  font-weight: 300;
}
.room-box--shortname {
  font-size: 20px;
  font-weight: normal;
  line-height: 28px;
  margin-bottom: 4px;
}
.room-box--speaker {
  font-size: 15px;
  font-weight: normal;
  line-height: 28px;
  margin-bottom: 4px;
}
.room-box--name {
  font-size: 12px;
  font-weight: normal;
  line-height: 16px;
  color: #566469;
}
.room-box--bottom > div > div {
  transition: 0.2s;
  cursor: pointer;
}
.room-box--bottom > div > div:hover {
  opacity: 0.7;
}
.room-box--participants {
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 15px 11px;
  background-color: #0f9d58;
  color: #fff;
}
.room-box--participants--red {
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 15px 11px;
  background-color: #db4437;
  color: #fff;
}
.room-box--participants--reserve {
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 15px 11px;
  background-color: #4285f4;
  color: #fff;
  opacity: 1;
}
button {
  cursor: pointer;
}
</style>
