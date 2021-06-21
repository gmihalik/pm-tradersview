import React from "react";
import TextField from "@material-ui/core/TextField";

import { useSelector } from "react-redux";
import { selectTrade } from "./tradeSlice";

export function Trade() {
  const tradeItem = useSelector(selectTrade);
  if (tradeItem.comment === "") {
    return <div></div>;
  }
  return (
    <React.Fragment>
      <form noValidate autoComplete="off">
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Action"
            fullWidth
            value={tradeItem.trade.action}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Underlying"
            fullWidth
            value={tradeItem.trade.underlying}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Expiration"
            fullWidth
            value={tradeItem.trade.expiration}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Strike"
            fullWidth
            value={tradeItem.trade.strike}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Call/Put"
            fullWidth
            value={tradeItem.trade.tradeType}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Author"
            fullWidth
            value={tradeItem.author}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
        <div className="formText">
          <TextField
            id="outlined-read-only-input"
            label="Comment"
            multiline
            fullWidth
            value={tradeItem.comment}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </div>
      </form>
    </React.Fragment>
  );
}
