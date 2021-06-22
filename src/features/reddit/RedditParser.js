import snoowrap from "snoowrap";

export function redditLogin() {
  return new snoowrap({
    userAgent: process.env.REACT_APP_USER_AGENT,
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
  });
}

export async function scrapeSubreddit(r) {
  return await new Promise((resolve) => {
    resolve(
      r
        .getSubreddit("PMTraders")
        .getNew({ time: "week", limit: 7 })
        .then((data) => {
          return data;
        })
    );
  });
}

export async function getThread(r, threadId) {
  return await new Promise((resolve) => {
    resolve(
      r
        .getSubmission(threadId)
        .expandReplies({ limit: Infinity, depth: Infinity })
        .then((submissions) => {
          return submissions.comments;
        })
    );
  });
}

export async function process_comment_line(comment) {
  return await new Promise(async (resolve) => {
    let commentArr = [];
    let author = comment.author.name;
    let commentLines = comment.body.split("\n");
    for (let i = 0; i < commentLines.length; i++) {
      let commentObj = { id: "", comment: "", author: "", fullComment: "" };

      if (commentLines[i].includes("STO")) {
        commentObj.id = comment.id + "_" + i;
        commentObj.author = author;
        commentObj.comment = commentLines[i]
          .replaceAll("*", "")
          .replaceAll("-\t", "")
          .replaceAll("\\-", "");
        commentObj.fullComment = comment.body_html;
        commentArr.push(commentObj);
      }

      if (i === commentLines.length - 1) {
        resolve(commentArr);
      }
    }
  });
}

export async function process_trade_info(comments) {
  return await new Promise((resolve) => {
    let commentsArr = [];
    for (let i = 0; i < comments.length; i++) {
      let tradeObj = {
        action: "",
        expiration: "",
        underlying: "",
        strike: "",
        tradeType: ""
      };
      let commentItem = comments[i].comment.split(" ");

      for (let x = 0; x < commentItem.length; x++) {
        let item = commentItem[x];
        if (item === "STO" || item === "BTC") {
          //tradeObj.action = item;
          tradeObj.action = tradeObj.action === "" ? item : tradeObj.action;
        } else if (item === "-1" || item === "+1") {
          tradeObj.action = item;
        } else if (/^(\d{1,2}\/\d{1,2})/.test(item)) {
          tradeObj.expiration = item;
        } else if (/^([$0-9pcCP.]+)/.test(item)) {
          if (item.length > 1) {
            //tradeObj.strike = item;
            if (tradeObj.strike === "") {
              tradeObj.strike = item
                .replace("P", "")
                .replace("C", "")
                .replace("p", "")
                .replace("c", "")
                .replace("(", "")
                .replace(")", "");
              if (
                item.toUpperCase().includes("P") ||
                item.toUpperCase().includes("C")
              ) {
                tradeObj.tradeType = item.toUpperCase().match(/[CPS]+/);
              }
            }
          }
        } else if (
          /^[A-Z]{0,4}$/.test(item) &&
          item !== "STO" &&
          item !== "IC" &&
          item !== "EOY"
        ) {
          //tradeObj.underlying = item;
          tradeObj.underlying =
            tradeObj.underlying === "" ? item : tradeObj.underlying;
        } else if (/([pcPC])\b/g.test(item)) {
          var match = /([pcPC])\b/g.exec(item);
          tradeObj.tradeType =
            tradeObj.tradeType === "" ? match[0] : tradeObj.tradeType;
        }
      }
      comments[i].trade = tradeObj;
      if (tradeObj.underlying !== "") {
        commentsArr = commentsArr.concat(comments[i]);
      }
      if (i === comments.length - 1) {
        //console.log(commentArr);
        resolve(commentsArr);
      }
    }
  });
}
