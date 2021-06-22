import snoowrap from "snoowrap";

export function redditLogin() {
  const r = new snoowrap({
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
          tradeObj.action = item;
        } else if (item === "-1" || item === "+1") {
          tradeObj.action = item;
        } else if (/^(\d{1,2}\/\d{1,2})/.test(item)) {
          tradeObj.expiration = item;
        } else if (/(\d+[^\/]\d+)/.test(item) || /(\d+[pcPC])/.test(item)) {
          tradeObj.strike = item;
          if (
            item.toUpperCase().includes("P") ||
            item.toUpperCase().includes("C")
          ) {
            tradeObj.tradeType = item
              .substring(item.length - 1, item.length)
              .toUpperCase();
          }
        } else if (
          /^([^0-9][A-Z]{1,4}[^a-z]\b)/.test(item) &&
          item !== "STO" &&
          item !== "IC"
        ) {
          tradeObj.underlying = item;
        } else if (/([pcPC])\b/g.test(item)) {
          console.log("item " + item);
          var match = /([pcPC])\b/g.exec(item);
          tradeObj.tradeType = match[0];
        }
      }
      comments[i].trade = tradeObj;
      if (i === comments.length - 1) {
        //console.log(commentArr);
        resolve(comments);
      }
    }
  });
}
