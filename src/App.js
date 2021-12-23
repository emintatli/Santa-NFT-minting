import './App.css';
import {useState,useEffect } from "react";
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css'; 
function App() {
    const [nftData,setNftData]=useState();
    const [contractData,setContractData]=useState();
    const [amount,setAmount]=useState(1);
    const [loading,setLoading]=useState(false);
    const location = useLocation();
    const [saleType,setSaleType]=useState("public");
    const [nftPrice,setNftPrice]=useState("0.025");
    const contractAddress="0x354b60d230Ab60C455D05A44bb7E1Df18BcE47B9";
    const contractAbi=[
      {
        "inputs": [],
        "name": "totalMint",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxMint",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "salesOpen",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "uint256", "name": "tokenCount", "type": "uint256" }
        ],
        "name": "awardItem",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }

    ]

    useEffect(()=>{
        if(location.pathname=="/"){
            setNftPrice("0.025");
            setSaleType("public");
         
        }
        else if(location.pathname=="/ps" || location.pathname=="/ps/"){
            setNftPrice("0.025");
            setSaleType("private");
        }
       
       
    },[location])
    const connectHandler=async()=>{
        try{
            setLoading(true);
            
          const accounts=await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider=window.ethereum;
          const userWallet=accounts[0];
          console.log(accounts)
          const web3 = new Web3(provider);
          let contract = new web3.eth.Contract(contractAbi,contractAddress);
          console.log(contract)
          const totalMint=await contract.methods.totalMint().call();
          const maxMint=await contract.methods.maxMint().call();
          const saleStatus=await contract.methods.salesOpen().call();
          console.log(totalMint,maxMint,saleStatus)
          setContractData({totalMint:totalMint.toString(),maxMint:maxMint.toString(),saleStatus});
          setNftData({
            provider,
            userWallet,
            contract,
          })
          setLoading(false);
        }
        catch(err){
            console.log(err)
            toast.error('🎅 Someting went wrong!', {
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                autoClose:false
                });
                setLoading(false);
        }
    
      }

      const mintHandler=async()=>{

        try{
            setLoading(true);
            
          const tx=await nftData.contract.methods.awardItem(nftData.userWallet,amount).send({from:nftData.userWallet,value:amount*Web3.utils.toWei(nftPrice, 'ether')})
          if(tx){
            toast.success('🎅 Thanks for minting your Degen Santa.Your minted santa will appear in OpenSea within 5 - 10 minutes. If you haven\'t already, please go to opensea.io and link your metamask account. Thanks again, and have a very merry degen Xmas', {
              position: "bottom-right",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              autoClose:false
              });
              setLoading(false);
        
              
          }
        }
         catch(err){
            console.log(err)
          toast.error('🎅 Someting went wrong!', {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            autoClose:false
            });
            setLoading(false);
        }
      }


      const psMintHandler=async()=>{

        try{
            setLoading(true);
          const tx=await nftData.contract.methods.awardItem(nftData.userWallet,amount).send({from:nftData.userWallet,value:amount=="1"?0:((amount-1)*Web3.utils.toWei(nftPrice, 'ether'))})
          if(tx){
            toast.success('🎅 Thanks for minting your Degen Santa.Your minted santa will appear in OpenSea within 5 - 10 minutes. If you haven\'t already, please go to opensea.io and link your metamask account. Thanks again, and have a very merry degen Xmas', {
              position: "bottom-right",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              autoClose:false
              });
              setLoading(false);
            
              
          }
        }
         catch(err){
            console.log(err)
          toast.error('🎅 Someting went wrong!', {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            autoClose:false
            });
            setLoading(false);
        }
      }


  return (
      <>
      <ToastContainer/>
     {saleType=="public"&&<div className="container">

<div className="shadow-box">
    <p className="minttext1">First 333 FREE (1 FREE PP), each Degen Santa costs 0.025 ETH after</p>
    <p className="minttext2">Excluding gas fees</p>
    
    {contractData&&<p className="minttext3">{contractData?.totalMint} / {contractData?.maxMint}</p>}

    <p className="minttext2">Connect your MetaMask wallet by clicking the button below.</p>
</div>
<div className="amount-group">
<a className="btn-default m-10 button-res" onClick={()=>{amount>1&&setAmount(amount-1)}}>-</a>
<a  className="btn-default m-10 button-res">{amount}</a>
<a className="btn-default m-10 button-res" onClick={()=>{amount<5&&setAmount(amount+1)}}>+</a>
</div>

<a className="btn-default" onClick={contractData?(contractData?.saleStatus&&mintHandler):connectHandler}>{loading?<><img width={50} src="/roll.svg"/></>:
<>{contractData?(contractData?.saleStatus?"Mint Santa":"Coming Soon"):"Connect Wallet"}</>}</a>
</div>}




{saleType=="private"&&    <div className="container">

<div className="shadow-box">
    <p className="minttext1">First 333 FREE (1 FREE PP), each Degen Santa costs 0.025 ETH after</p>
    <p className="minttext2">Excluding gas fees</p>
    
    {contractData&&<p className="minttext3">{contractData?.totalMint} / {contractData?.maxMint}</p>}
   <br/>
    <p className="minttext2">Connect your MetaMask wallet by clicking the button below.</p>
</div>
<div className="amount-group">
<a  className="btn-default m-10 button-res" onClick={()=>{amount>1&&setAmount(amount-1)}}>-</a>
<a  className="btn-default m-10 button-res">{amount}</a>
<a className="btn-default m-10 button-res" onClick={()=>{amount<5&&setAmount(amount+1)}}>+</a>
</div>

<a className="btn-default" onClick={contractData?(contractData&&psMintHandler):connectHandler}>{loading?<><img width={50} src="/roll.svg"/></>:
<>{contractData?("Mint Santa"):"Connect Wallet"}</>}</a>
</div>}

</>

  );
}

export default App;
