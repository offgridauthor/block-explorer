import React, { useState, useEffect } from 'react'

export default function BlockTable() {
  const ethers = require('ethers')
  const urls = {
    rinkeby: process.env.ALCHEMY_RINKEBY_URL,
    mainnet: process.env.ALCHEMY_MAINNET_URL,
  }

  const tHeads = [
    'Block',
    'Timestamp',
    'Transactions',
    'Miner',
    'Gas Used',
    'Gas Limit',
  ]
  const [activeProvider, setActiveProvider] = useState(urls.rinkeby)
  let provider = new ethers.providers.JsonRpcProvider(activeProvider)
  const [blockData, setBlockData] = useState([])
  const [headerData, setHeaderData] = useState([])
  const blockCount = 5 // higher values take 100 years to render
  let [isLoading, setIsLoading] = useState(false)

  function toggleActiveProvider() {
    activeProvider == urls.rinkeby
      ? setActiveProvider(urls.mainnet)
      : setActiveProvider(urls.rinkeby)
    provider = new ethers.providers.JsonRpcProvider(activeProvider)
    // setIsLoading=true
    fetchHeaderData().then((response) => {
      setHeaderData(response)
    })
    fetchBlockData().then((response) => {
      // console.log(response)
      setBlockData(response)
    })
    // setIsLoading=false
  }

  useEffect(() => {
    // setIsLoading=true
    fetchHeaderData().then((response) => {
      setHeaderData(response)
      // setIsLoading=false
    })
  }, [setHeaderData])

  useEffect(() => {
    // setIsLoading=true
    fetchBlockData().then((response) => {
      // console.log(response)
      setBlockData(response)
      // setIsLoading=false
    })
  }, [setBlockData])

  const fetchHeaderData = async () => {
    const gasPrice = await provider.getGasPrice()
    const { name } = await provider.getNetwork()
    const result = {
      gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
      chainId: name,
    }
    return result
  }

  const fetchBlockData = async () => {
    // console.log(block)
    const blocksArr = []
    let block = await provider.getBlock()
    blocksArr.push(block)
    for (let i = 1; i < blockCount; i++) {
      block = await provider.getBlock(block.number - 1)
      // console.log(i + " BLOCK " + block)
      blocksArr.push(block)
    }
    return processBlockData(blocksArr)
  }

  const processBlockData = (blocksArr) => {
    const tableRow = []
    for (let blockObj of blocksArr) {
      tableRow.push({
        num: blockObj.number,
        timestamp: blockObj.timestamp,
        txs: blockObj.transactions.length,
        miner: '0x....' + blockObj.miner.slice(-8, -1),
        gasUsed: blockObj.gasUsed._hex,
        gasLimit: blockObj.gasLimit._hex,
      })
    }
    return tableRow
  }

  const onBlockSelect = (block) => {}

  return (
    <div>
      {/* {isLoading ? ( */}
      {blockData.length < 1 ? (
        <div className='nes-container with-title is-centered is-rounded'>
          LOADING...
          <progress
            className='nes-progress is-pattern'
            value='50'
            max='100'
          ></progress>
        </div>
      ) : (
        <div>
          <div className="list-container">
            <h5 className='nes-list is-circle'>
              <ul>
                <li>
                  Gas Price: <i className='nes-icon coin is-small'></i>
                  {headerData && headerData.gasPrice} gwei
                </li>
                <li>
                  Blockchain:{' '}
                  <button
                    type='button'
                    className='nes-btn is-primary'
                    onClick={toggleActiveProvider}
                  >
                    {headerData && headerData.chainId == 'rinkeby' ? (
                      <i className='nes-icon trophy is-small'></i>
                    ) : (
                      <i className='nes-icon star is-small'></i>
                    )}
                    {headerData && headerData.chainId}{' '}
                  </button>
                </li>
              </ul>
            </h5>
          </div>
          <div className='nes-table-responsive'>
            <table className='nes-table is-bordered is-cenered'>
              <thead>
                <tr>
                  {tHeads.map((title) => (
                    <td key={tHeads.indexOf(title)}>{title}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blockData.map((val) => (
                  <tr
                    key={val.num}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <td>{val.num}</td>
                    <td>{val.timestamp}</td>
                    <td>{val.txs}</td>
                    <td>{val.miner}</td>
                    <td>{val.gasUsed}</td>
                    <td>{val.gasLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
