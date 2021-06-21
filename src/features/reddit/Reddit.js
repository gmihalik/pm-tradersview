import React, { Component } from "react";
import snoowrap from "snoowrap";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "../utils/Title";
import ChartButton from "../utils/ChartButton";

class Reddit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
  }

  componentDidMount() {
    this.scrapeSubreddit();
    //window["loadChart"]("SPY");
    window.helloComponent = this;
  }

  async scrapeSubreddit() {
    const r = new snoowrap({
      userAgent: process.env.REACT_APP_USER_AGENT,
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
      refreshToken: process.env.REACT_APP_REFRESH_TOKEN
    });
    const subreddit = await r.getSubreddit("PMTraders");
    await subreddit.getNew({ time: "week", limit: 7 }).then((data) => {
      console.log(data);

      r.getSubmission(data[0].id)
        .expandReplies({ limit: Infinity, depth: Infinity })
        .then((submissions) => {
          submissions.comments.forEach((comment) => {
            this.process_comment_line(comment);
          });
        })
        .then(() => {
          console.log(this.state);
        });
    });
  }

  process_comment_line(comment) {
    let commentArr = this.state.comments;
    let author = comment.author.name;
    let commentLines = comment.body.split("\n");
    commentLines.forEach((line, index) => {
      if (line.includes("STO") || line.includes("-1")) {
        //console.log(line);
        let commentObj = { id: "", comment: "", author: "", fullComment: "" };
        commentObj.id = comment.id + "_" + index;
        commentObj.author = author;
        commentObj.comment = line
          .replaceAll("*", "")
          .replaceAll("-\t", "")
          .replaceAll("\\-", "");
        commentObj.fullComment = comment.body_html;
        commentObj.trade = this.process_trade_info(commentObj.comment);

        commentArr.push(commentObj);
      }
    });
    this.setState({ comments: commentArr });
  }
  process_trade_info(comment) {
    let tradeObj = {
      action: "",
      expiration: "",
      underlying: "",
      strike: "",
      tradeType: ""
    };
    //console.log(comment.split(" "));
    comment.split(" ").forEach((item) => {
      //console.log(item);
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
    });
    return tradeObj;
  }
  preventDefault(event) {
    event.preventDefault();
  }

  loadChart(tradeItem) {
    window.loadChart(tradeItem.trade.underlying);
    this.loadTrade(tradeItem);
  }

  loadTrade(tradeItem) {
    window.loadChart(tradeItem.trade.underlying);
  }

  render() {
    return (
      <React.Fragment>
        <Title>Posts</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Underlying</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Strike</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Full Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.comments.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <ChartButton tradeItem={row}>View</ChartButton>
                </TableCell>
                <TableCell>{row.trade.action}</TableCell>
                <TableCell>{row.trade.underlying}</TableCell>
                <TableCell>{row.trade.expiration}</TableCell>
                <TableCell>{row.trade.strike}</TableCell>
                <TableCell>{row.trade.tradeType}</TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{row.comment}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default Reddit;
