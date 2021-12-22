import './App.css';
import {useState} from "react";
import {loadContract} from "./loadContract"
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css'; 
import { useEffect } from 'react/cjs/react.development';
function App() {
    const [nftData,setNftData]=useState();
    const [contractData,setContractData]=useState();
    const [amount,setAmount]=useState(1);
    const [loading,setLoading]=useState(false);
    const location = useLocation();
    const [saleType,setSaleType]=useState("public");
    const [nftPrice,setNftPrice]=useState("0.025");

    useEffect(()=>{
        if(location.pathname=="/"){
            setNftPrice("0.025");
            setSaleType("public");
         
        }
        else if(location.pathname=="/fwl"){
            setAmount(1);
            setNftPrice("0");
            setSaleType("free");

        }
        else if(location.pathname=="/ps"){
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
          const contract=await loadContract("DegenSanta",provider);
          const totalMint=await contract.totalMint();
          const maxMint=await contract.maxMint();
          const saleStatus=await contract.salesOpen();
          setContractData({totalMint:totalMint.words[0].toString(),maxMint:maxMint.words[0].toString(),saleStatus});
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
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
                setLoading(false);
        }
    
      }

      const mintHandler=async()=>{

        try{
            setLoading(true);
          const tx=await nftData.contract.awardItem(nftData.userWallet,amount,{from:nftData.userWallet,value:amount*Web3.utils.toWei(nftPrice, 'ether')})
          if(tx){
            toast.success('🎅 Thanks for your purchasing your Degen Santa. We\'ll now redirect you to your OpenSea account. Your minted Santa should appear within 5 - 10 minutes. Merry Xmas', {
              position: "bottom-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
              });
              setLoading(false);
              setTimeout(()=>{
                window.location.replace("https://testnets.opensea.io/account");
              },10000)
              
          }
        }
         catch(err){
            console.log(err)
          toast.error('🎅 Someting went wrong!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            setLoading(false);
        }
      }



  return (
      <>
      <ToastContainer/>
     {<div class="container">

<div class="shadow-box">
    <p class="minttext1">First 333 FREE, each Degen Santa costs 0.03 ETH after</p>
    <p class="minttext2">Excluding gas fees</p>
    
    {contractData&&<p class="minttext3">{contractData?.totalMint} / {contractData?.maxMint}</p>}
   <br/>
    <p class="minttext2">Connect your wallet to the Ethereum network</p>
</div>
<div class="amount-group">
<a onClick="" class="btn-default m-10 button-res" onClick={()=>{amount>1&&setAmount(amount-1)}}>-</a>
<a  class="btn-default m-10 button-res">{amount}</a>
<a onClick="" class="btn-default m-10 button-res" onClick={()=>{amount<5&&setAmount(amount+1)}}>+</a>
</div>

<a class="btn-default" onClick={contractData?(contractData?.saleStatus&&mintHandler):connectHandler}>{loading?<><img width={50} src="/roll.svg"/></>:
<>{contractData?(contractData?.saleStatus?"Mint Santa":"Coming Soon"):"Connect"}</>}</a>
</div>}




{saleType=="private"&&    <div class="container">

<div class="shadow-box">
    <p class="minttext1">First 333 FREE, each Degen Santa costs 0.03 ETH after</p>
    <p class="minttext2">Excluding gas fees</p>
    
    {contractData&&<p class="minttext3">{contractData?.totalMint} / {contractData?.maxMint}</p>}
   <br/>
    <p class="minttext2">Connect your wallet to the Ethereum network</p>
</div>
<div class="amount-group">
<a onClick="" class="btn-default m-10 button-res" onClick={()=>{amount>1&&setAmount(amount-1)}}>-</a>
<a  class="btn-default m-10 button-res">{amount}</a>
<a onClick="" class="btn-default m-10 button-res" onClick={()=>{amount<5&&setAmount(amount+1)}}>+</a>
</div>

<a class="btn-default" onClick={contractData?(contractData?.saleStatus&&mintHandler):connectHandler}>{loading?<><img width={50} src="/roll.svg"/></>:
<>{contractData?("Mint Santa"):"Connect"}</>}</a>
</div>}




{saleType=="free"&&    <div class="container">

<div class="shadow-box">
    <p class="minttext1">First 333 FREE, each Degen Santa costs 0.025 ETH after</p>
    <p class="minttext2">Excluding gas fees</p>
    
    {contractData&&<p class="minttext3">{contractData?.totalMint} / {contractData?.maxMint}</p>}
   <br/>
    <p class="minttext2">Connect your wallet to the Ethereum network</p>
</div>
<div class="amount-group">
<a  class="btn-default m-10 button-res">{amount}</a>
</div>

<a class="btn-default" onClick={contractData?(contractData?.saleStatus&&mintHandler):connectHandler}>{loading?<><img width={50} src="/roll.svg"/></>:
<>{contractData?("Mint Santa"):"Connect"}</>}</a>
</div>}


</>

  );
}

export default App;
