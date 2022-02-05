import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function BlockTable() {
  const ethers = require('ethers')
  const url = process.env.ALCHEMY_RINKEBY_URL
  const provider = new ethers.providers.JsonRpcProvider(url)
  const tHeads = [
    'Block',
    'Timestamp',
    'Transactions',
    'Miner',
    'Gas Used',
    'Gas Limit',
  ]
  const [blockData, setBlockData] = useState([])
  const [headerData, setHeaderData] = useState([])
  const blockCount = 5 // higher values take 100 years to render

  useEffect(() => {
    fetchHeaderData().then((response) => {
      setHeaderData(response)
    })
  }, [setHeaderData])

  useEffect(() => {
    fetchBlockData().then((response) => {
      // console.log(response)
      setBlockData(response)
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
        miner: blockObj.miner,
        gasUsed: blockObj.gasUsed._hex,
        gasLimit: blockObj.gasLimit._hex,
      })
    }
    return tableRow
  }

  const onBlockSelect = (block) => {}

  return (
    <div>
      {blockData.length < 1 ? (
        <tr>
          LOADING...
          <progress
            className='nes-progress is-pattern'
            value='50'
            max='100'
          ></progress>
        </tr>
      ) : (
        <div>
          <h5 className='nes-list is-circle'>
            <ul>
              <li>
                Gas Price: <i class='nes-icon coin is-small'></i>
                {headerData && headerData.gasPrice} gwei
              </li>
              <li>
                Blockchain:{' '}
                <button type='button' className='nes-btn is-primary'>
                  {headerData && headerData.chainId == 'rinkeby' ? (
                    <i class='nes-icon trophy is-small'></i>
                  ) : (
                    <i class='nes-icon star is-small'></i>
                  )}
                  {headerData && headerData.chainId}{' '}
                </button>
              </li>
            </ul>
          </h5>
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
