import React from "react";
import axios from "axios";
import sadface from '../images/sad.png'

class NewAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerText: '',
            userVerified: false,
            isServerNull: false,
        };
    }

    componentDidMount(){
      this.serverCheck();
        this.userCheck();
    }

    serverCheck = () => {
      axios
        .get('http://localhost:8000/show')
        .then((response) => {
          this.setState({ isServerNull: true });
        })
        .catch((error) => {
          this.setState({ isServerNull: false });
        });
    };

    userCheck = () => {
        axios
          .get('http://localhost:8000/CheckSession', { withCredentials: true })
          .then((response) => {
            const checker = response.data;
            //console.log(checker);
      
            if (checker.validated) {
              this.setState({ userVerified: true }, () => {
                //console.log(this.state.userVerified);
              });
            } else {
              this.setState({ userVerified: false }, () => {
                //console.log(this.state.userVerified);
              });
            }
          })
          .catch((error) => {
            console.error("Error", error);
          });
      };
      

    checkInput = () => {
        const text = this.state.answerText.trim();
        document.getElementById("box33").innerHTML = "";

        if (text.length === 0) {
          document.getElementById("boxer22").innerHTML = "Please fill in the answer question field above.";
          return false;
        } else {
          document.getElementById("boxer22").innerHTML = "";
        }

        const patternCheck = /[[\]()]/;
        const patternCheck2 = /]\(/;

        if (patternCheck.test(text) && patternCheck2.test(text)) {
            const isPatternValid = this.checkPattern(text);
            if (isPatternValid) {
              return true;
            }
          } else {
            return true;
          }

      }

      checkPattern = (text) => {
              
        const validPattern = /\[[^\]]+\]\(https?:\/\/[^\s)]+\)/;

        if (validPattern.test(text)) {
          document.getElementById("box33").innerHTML = "";
          return true; 
        }
        document.getElementById("box33").innerHTML = "The pattern in the text field is missing 'http://' or 'https://'. Please fix it.";
        return false;
        
      }

      postAnswerreCheck = () => {
        const isInputValid = this.checkInput();

        if (isInputValid) {
          this.postAnswer();
        }
      }

    postAnswer = () => {
        const { answerText } = this.state;
        const modifiedAnswerText = answerText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        if (modifiedAnswerText) {
            
            const postValues = {
                text: modifiedAnswerText,
                questionId: this.props.questionID,
            }

            axios.post('http://localhost:8000/postAnswer', postValues, {withCredentials: true});
            
            this.setState({
                answerText: "",
            });
            
            // this.props.questionID
            this.props.displayA(this.props.questionID);
            // this.props.defaultLoad();
        }
    };

    render() {
        const { answerText } = this.state;
        let content;
        
        if(this.state.userVerified){
          content = (
          <div style={{ margin: '5% auto', width: '60%', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1><center>&nbsp;&nbsp;Answer Question</center></h1>
              <button style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.props.defaultLoad}>Cancel</button>
          </div>
      
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                  <textarea
                      type="text"
                      id="answerText"
                      placeholder="Please enter your answer here!"
                      required
                      value={answerText}
                      style={{ width: '95%', padding: '12px', border: 'none', resize: 'vertical', minHeight: '200px' }}
                      onChange={(event) => {
                          this.setState({ answerText: event.target.value });
                          this.checkInput();
                      }}
                  />
              </div>
              <div id="boxer22" style={{ color: 'red' }}></div>
              <div id="box33" style={{ color: 'red' }}></div>
          </div>
      
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                style={{ backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  id="postAnswerButton"
                  disabled={this.checkInput === true}
                  onClick={this.postAnswerreCheck}
              >
                  Post Answer
              </button>
              <div style={{ color: 'red', fontSize: '14px' }}>* indicates mandatory fields</div>
          </div>
      </div>
      
      )        
      }
      else if(!this.state.isServerNull){
        return (
          <div>
  
            <center>
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <img src={sadface} alt="Sad Face" width="100" />
                <h1>Server Error! :(</h1>
                <h3>Please refresh the page!</h3>
  
                <a className="left-panel-buttons blue"
                  style={{ marginRight: '10px' }}
                  href="/" onClick={() => window.location.href = '/'}> Refresh </a>
              </div>
            </center>
          </div>
  
        )
      }
      else{
          content = (
              <div>
              
              <center>
                  <div style={{ textAlign: 'center', marginTop: '50px' }}>
                      <img src={sadface} alt="Sad Face" width="100" />
                      <h1>You must be logged in to view this page!</h1>
                      <h3>Click Here to Navigate to the Login/Register Page!</h3>
                     
                      <a className="left-panel-buttons blue"
                        style={{ marginRight: '10px' }}
                        href="/" onClick={this.props.newLoader}> Login </a>
                      </div>
                      </center>
              </div>
              );
      }

        return (
            <div>
                {content}
            </div>
            // {content}
        );
    }
}

export default NewAnswer;
