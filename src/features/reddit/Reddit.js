import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ChartButton from "../utils/ChartButton";
import * as redditParser from "./RedditParser.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const r = redditParser.redditLogin();

class Reddit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      title: "",
      threads: [],
      post: ""
    };
  }
  loadThread(r, threadId) {
    redditParser.getThread(r, threadId).then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        await redditParser
          .process_comment_line(result[i])
          .then(async (result) => {
            if (result.length > 0) {
              await redditParser.process_trade_info(result).then((trades) => {
                trades.forEach((item) => {
                  this.setState((prevState) => ({
                    comments: [...prevState.comments, item]
                  }));
                });
              });
            }
          });
      }
    });
  }

  componentDidMount() {
    redditParser.scrapeSubreddit(r).then((data) => {
      this.setState({ threads: data });
      this.setState({ post: data[0].id });
      this.loadThread(r, data[0].id);
      console.log(data);
      window.loadChart("SPY");
    });
    //window["loadChart"]("SPY");
    //window.helloComponent = this;
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
  handleChange = (event) => {
    this.setState({ post: event.target.value });
    this.setState({ comments: [] });
    this.loadThread(r, event.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <Select
          labelId="reddit-post-select-label"
          id="reddit-post-select"
          value={this.state.post}
          onChange={this.handleChange}
        >
          {this.state.threads.map((item) => (
            <MenuItem value={item.id}>{item.title}</MenuItem>
          ))}
        </Select>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Underlying</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Strike</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Comment</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default Reddit;
