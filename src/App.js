import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Row, Col } from "styled-bootstrap-grid";
import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";
import harvest from "./lib/index.js";
import Loadable from 'react-loadable';
import { darkTheme, lightTheme, fonts } from "./styles/appStyles.js";
import axios from 'axios';
import ReactModal from 'react-modal-resizable-draggable';

// images
import logo from "./assets/gif_tractor.gif";


// components
import Wallet from "./components/Wallet.jsx";
import MainContent from './components/MainContent';
import RadioPanel from './components/radioPanel/RadioPanel';

import WelcomeText from './components/WelcomeText';

const { ethers } = harvest;
const GlobalStyle = createGlobalStyle`
  ${reset}
 
  
  html {
    /* 1rem = 10px */
    font-size: 62.5%;
    height: 100%;
  }



  body {
    height: 100%;
    background-color: ${(props) => props.theme.style.bodyBackground};
  }


  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 6rem;
    height: 2.6rem;
    @media(max-width: 500px) {
      height: 2.4rem;
      width: 5.5rem;
    }
    
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props) => props.theme.style.blueBackground};
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.9rem;
    width: 1.9rem;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    @media(max-width: 500px) {
      height: 1.7rem;
      width: 1.7rem;
    }
  }

  input:checked + .slider {
    background-color: ${(props) => props.theme.style.blueBackground};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ${(props) => props.theme.style.blueBackground};
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(3.3rem);
    -ms-transform: translateX(3.3rem);
    transform: translateX(3.3rem);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: .5rem;
  }

  .slider.round:before {
    border-radius: .5rem;
  }

  input[type="button"]:focus, button:focus {
      outline: none;
  }


  input[type="number"] {
    -moz-appearance: textfield;
    background-color: ${(props) => props.theme.style.lightBackground};
    border: 0.2rem solid #363636;
    font-size: 1.4rem;
    color: ${(props) => props.theme.style.primaryFontColor};
    width: 8rem;
    text-align: center;
    border-radius: 0.5rem;
    padding: 0.3rem 0.7rem;
    @media(max-width: 1400px) {
      width: 6rem;
    }
    @media(max-width: 1280px) {
      width: 5rem;
    }
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
  }

  .button {
    background: ${(props) => props.theme.style.highlight};
    border: ${(props) => props.theme.style.smallBorder};
    box-shadow: ${(props) => props.theme.style.buttonBoxShadow};
    box-sizing: border-box;
    border-radius: 0.8rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-family: TechnaSans;
    color: ${(props) => props.theme.style.buttonFontColor};
    font-size: 1.2rem;

    &.ghost {
      background: transparent;
      border: 0px;
      box-shadow: none;
      color: ${(props) => props.theme.style.linkColor};
      font-family: ${fonts.headerFont};
      padding: 0px;
    }

    &.alert {
      background-color: ${(props) => props.theme.style.alertColor}
    }
  }

  .spread-row {
    justify-content: space-between;
  }

  div[data-name="row"] {
    margin-bottom: 1.5rem;
  }
`;

// App
const Brand = styled.div`

  padding-right: 1rem;
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  height: 2.5rem;
  

  img {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    margin-left: .5rem;
  }

  span {
    color: ${(props) => props.theme.style.primaryFontColor};
    font-family: ${fonts.contentFont};
    font-size: 2.5rem;
  }

  @media(min-width: 1500px) {
    margin: 2.5rem 0;
  }
`;

const Panel = styled.div`
  position: relative;
  padding: 2.5rem 2.5rem;
  border: ${(props) => props.theme.style.mainBorder};
  border-radius: 1rem;
  border-top-left-radius: 0rem;
  margin-top: -1.5rem;
  background-color: ${(props) => props.theme.style.panelBackground};
  z-index: 1;
  box-sizing: border-box;
  box-shadow: ${(props) => props.theme.style.panelBoxShadow};
  

  &.four-corner {
    border-top-left-radius: 1rem;
    background-color: #1d1d1d;
    color: ${(props) => props.theme.style.primaryFontColor};
    font-size: 1.6rem;
    font-family: TechnaSans;
  }

  .flexible-modal {
    position: absolute;
    z-index: 1;
    background-color: #ddd;
    height: 100%;
    height: 12rem;
    border: 1px solid black;
    border-radius .5rem;
    background-color: ${(props) => props.theme.style.highlight};
    box-shadow: ${(props) => props.theme.style.panelTabBoxShadow};
    
  }
  
  
  
  .flexible-modal-drag-area{
    background-color: transparent;
    position:absolute;
    right:0;
    top:0;
    cursor:grab;
    height: 12rem;
    
    
    
  }

  

  
  
`;

const PanelTab = styled.div`
  margin-right: 0.75rem;
  border-radius: 1.2rem;
  border-top: ${(props) => props.theme.style.mainBorder};
  border-left: ${(props) => props.theme.style.mainBorder};
  border-right: ${(props) => props.theme.style.mainBorder};
  padding: 0.75rem 2rem 2.25rem 2rem;
  background-color: ${(props) => props.theme.style.highlight};
  box-shadow: ${(props) => props.theme.style.panelTabBoxShadow};
  
  cursor: pointer;
  color: ${(props) => props.theme.style.buttonFontColor};

  
  

  a {
    color: ${(props) => props.theme.style.panelTabLinkColor};
    text-decoration: none;
    font-family: ${fonts.contentFont};
    font-size: 2.4rem;
    position: relative;
    top: .1rem;
    @media(max-width: 500px) {
      font-size: 1.8rem;
    }
   
  }
  @media(max-width: 500px) {
    font-size: 1.9rem;
    padding: 0.75rem 1rem 2.4rem 1rem;
    position: relative;
    top: .1rem;
    a {
      top: .4rem;
    }
  }
  @media(max-width: 330px) {
    font-size: 1.7rem;
    padding: 0.75rem .75rem 2.4rem .75rem;
    position: relative;
    top: .1rem;
    a {
      top: .4rem;
    }
  }

  &.wiki-tab {
    position: relative;
    background-color: ${(props) => props.theme.style.wikiTabBackground};
    top: 0.4rem;
    margin-left: 2.5rem;
    

    &:hover {
      top: 0rem;
    }

    a {
      color: ${(props) => props.theme.style.primaryFontColor};
      font-size: 1.9rem;
      position: relative;
      top: .1rem;
    }
    @media(max-width: 500px) {
      top: 0.9rem;
      a {
        font-size: 1.7rem;
      }
      
    }
  }
    &.switch-panel {
      margin-right: 1.2rem;
      position: relative;
      top: .6rem;
      padding: 0.4rem .5rem 1rem .5rem;

      @media(max-width: 500px) {
        top: 1.2rem;
        padding: 0.4rem .5rem 3rem .5rem;
      }
      
    }

    &.radio-tab {
      position: relative;
      font-size: 1.9rem;
      top: .5rem;
      margin-left: 2.5rem;
      font-family: ${fonts.contentFont};
      &:hover {
        top: 0rem;
      }

    }
  
`;

const PanelTabContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PanelTabContainerLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const PanelTabContainerRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Container = styled.div`
  width: 85%;
  margin: 0 auto;
 
  
`;

const RadioTitle=styled.div`
display: flex;
align-items: center;
justify-content: center;
text-align: center;
font-family: ${fonts.headerFont};
font-size: 1.7rem;
position: relative:
z-index: 400;
pointer-events: auto;
h4 {
  margin-top: .2rem;
}
`;

const CloseIcon = styled.span`
  position: absolute;
  right: 1.3rem;
  top: .2rem;
  font-size: 1.7rem;
  cursor: pointer;
  color: ${(props) => props.theme.style.buttonFontColor};

  .fas {
    position: relative;
    z-index: 500;
    &:hover {
      top: 1.5px;
    }
  }
`;



const ErrorModal = Loadable({
  loader: () => import('./components/ErrorModal'),
  loading() {
    return null
  }
})

function App() {
  
  const [state, setState] = useState({
    provider: undefined,
    signer: undefined,
    manager: undefined,
    address: "",
    summaries: [],
    underlyings: [],
    usdValue: 0,
    error: { message: null, type: null, display: false },
    theme: window.localStorage.getItem("HarvestFinance:Theme") || "light",
    display: false,
    minimumHarvestAmount: 0,
    apy: 0,
    farmPrice: 0
  });

  const getPools = async () => {
    const poolsData = await axios.get(
      "https://api-ui.harvest.finance/pools?key=41e90ced-d559-4433-b390-af424fdc76d6",
    ).then(res => {
      let currentAPY = res.data[0].rewardAPY;
      let currentPrice = res.data[0].lpTokenData.price;
      
      setState({...state,apy: currentAPY, farmPrice: currentPrice})
      
    })
    .catch(err => {
      console.log(err)
    })
    
    
    
  };
  
 


  useEffect(() => {
  
    const timer = setTimeout(() => {
      state.manager && refresh();
    }, 60000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      state.manager && getPools();
    }, 60000);
    return () => clearTimeout(timer);
  });
  useEffect(() => {
    getPools()
  },[])



  useEffect(() => {
    if (state.address !== "") {
      refresh();
      
    }
   
  }, [state.address]);
  useEffect(() => {
    if(state.usdValue) {
      setState({...state,display: true})
    }
  },[state.usdValue])

  const disconnect = () => {
    setState({
      provider: undefined,
      signer: undefined,
      manager: undefined,
      address: "",
      summaries: [],
      underlyings: [],
      usdValue: 0,
      apy: 0,
      error: { message: null, type: null, display: false },
      theme: window.localStorage.getItem("HarvestFinance:Theme") || "light",
      
      
    });
  };

  const closeErrorModal = () => {
    setState({
      ...state,
      error: { message: null, type: null, display: false },
    });
  };

  const openModal = (message, type) => {
    setState({
      ...state,
      error: { message: message, type: type, display: true },
    });
  };

  const setConnection = (provider, signer, manager) => {
    setState({
      ...state,
      provider: provider,
      signer: signer,
      manager: manager,
    });
  };

  const setAddress = (address) => {
    setState((state) => ({ ...state, address: address }));
  };

  const refresh = () => {
    state.manager
      .aggregateUnderlyings(state.address)
      .then((underlying) => {
        return underlying.toList().filter((u) => !u.balance.isZero());
      })
      .then((underlyings) => {
        setState({ ...state, underlyings: underlyings });
      }).catch(err => {
        console.log(err)
      });

    state.manager
      .summary(state.address)
      .then((summaries) =>
        summaries.filter(
          (p) =>
            !p.summary.earnedRewards.isZero() ||
            !p.summary.stakedBalance.isZero() ||
            (p.summary.isActive && !p.summary.unstakedBalance.isZero()),
        ),
      )
      .then((summaries) => {
        let total = ethers.BigNumber.from(0);
        summaries.forEach((pos) => {
          total = total.add(pos.summary.usdValueOf);
        });
        setState((state) => ({
          ...state,
          summaries: summaries,
          usdValue: total,
        }));
        
        return summaries;
      }).catch(err => {
        refresh()
        
      });
  };

  const toggleTheme = (theme) => {
    setState({ ...state, theme: theme });
    window.localStorage.setItem("HarvestFinance:Theme", theme);
  };
  //Radio Modal
  const[radio,setRadio] =useState(false)

  const toggleRadio = () => {
    setRadio(!radio)
  }
 

  return (
    <ThemeProvider theme={state.theme === "dark" ? darkTheme : lightTheme}>
      <GlobalStyle />
        <Container>
          <Row>
            <Col col>
              <Brand>
                <img src={logo} alt="harvest finance logo" />{" "}
                <span>harvest.dashboard</span>
              </Brand>
            </Col>
          </Row>

          <Row>
            <Col>
              <PanelTabContainer>
                <PanelTabContainerLeft>
                  <PanelTab>
                    <a
                      href="https://harvest.finance"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      harvest.finance
                    </a>
                  </PanelTab>
                  <PanelTab className="wiki-tab">
                    <a
                      href="https://farm.chainwiki.dev/en/home"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      wiki
                    </a>
                  </PanelTab>

                  <PanelTab 
                  className="radio-tab"
                  onClick={toggleRadio}
                  >
                    
                    <p>radio</p>
                  </PanelTab>
                </PanelTabContainerLeft>

                <PanelTabContainerRight>
                  <PanelTab className='switch-panel'>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={state.theme === "dark" ? true : false}
                        onChange={() =>
                          toggleTheme(state.theme === "dark" ? "light" : "dark")
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </PanelTab>
                  
                </PanelTabContainerRight>
              </PanelTabContainer>

              <Panel>

              {/* RADIO MODAL */}
              <ReactModal
                isOpen={radio}
                onRequestClose={toggleRadio}
                onFocus={() => console.log("Modal is clicked")}
                className={"my-modal-custom-class"}
                initWidth={325} 
                initHeight={100}
                top={15}
                left={50}
                disableResize={true}
                >
                <RadioTitle>
                  <h4>Harvest Radio</h4>
                  <CloseIcon onClick={toggleRadio} ><i className="fas fa-times-circle "></i></CloseIcon>
                </RadioTitle>
                <RadioPanel toggleRadio={toggleRadio} />
              </ReactModal>

              {/* RADIO MODAL */}


                 {state.address? <Row>
                   
                  <Col >
                    <Wallet
                      state={state}
                      openModal={openModal}
                      disconnect={disconnect}
                      setConnection={setConnection}
                      setAddress={setAddress}
                      refresh={refresh}
                    />
                  </Col>
                </Row> : null}
                

                 
                
                {state.provider ? (
                  <MainContent 
                  state={state} 
                  setState={setState}
                  openModal={openModal}/>
                ) :
                <Row >
                  <Col >
                    <WelcomeText 
                      state={state}
                      openModal={openModal}
                      disconnect={disconnect}
                      setConnection={setConnection}
                      setAddress={setAddress}
                      refresh={refresh}
                     />
                  </Col>
                  
                  </Row>} 
              </Panel>
            </Col>
          </Row>
        </Container>
        <ErrorModal state={state} onClose={() => closeErrorModal()} />
    </ThemeProvider>
  );
}

export default App;
