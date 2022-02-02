// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.hideTodaySession = functions.pubsub.schedule('0 18 * * *')
  .timeZone('Asia/Tokyo').onRun((context) => {
    db = admin.firestore();
    var today = getDate();
    var sessionIds = [];

    return db.collection("sessions")
      .where("digitalDate", "==", today)
      .get()
      .then(querySnapshot => {
        return querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          console.log("doc.data().digitalDate", doc.data().digitalDate);
          var sessionId = doc.data().id;
          sessionIds.push(sessionId);
          console.log("session id: ", sessionId);
          var sessionRef = db.collection("sessions").doc(sessionId);
          sessionRef.update({
            isDone: true,
          });
          // それを登録していた全学生のデータを取得
          return sessionRef
            .collection("students")
            .get()
            .then(querySnapshot => {
              return querySnapshot.forEach(doc => {
                var userEmail = doc.data().email;
                // doc.data() is never undefined for query doc snapshots

                const fieldValue = admin.firestore.FieldValue;
                const decrement = fieldValue.increment(-1);
                const studentRef = db.collection("students").doc(userEmail);
                // students 内の sessionsToJoin 配列からその回を削除
                studentRef.update({
                  sessionsToJoin: fieldValue.arrayRemove(sessionId),
                });
                // その student の参加予定回数 (numSessions) をデクリメント
                studentRef.update({ numSessions: decrement });
                console.log(userEmail + " was successfully dealed with.");
              });
            })
            .catch(error => {
              console.log(error);
            });
        });
      })
      .catch(error => {
        console.log(error);
      });
  });

function getDate() {
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
}