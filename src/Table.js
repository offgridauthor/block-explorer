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
  const url = process.env.REACT_APP_ALCHEMY_RINKEBY_URL
  const provider = new ethers.providers.JsonRpcProvider(url)
  const tHeads = ['Block', 'Timestamp', 'Txn', 'Miner', 'Gas Used', 'Gas Limit']
  const [blockData, setBlockData] = useState([])
  const [headerData, setHeaderData] = useState([])
  const blockCount=25

  useEffect(() => {
    fetchHeaderData().then((response) => {
      setHeaderData(response)
    })
  }, [setHeaderData])

  useEffect(() => {
    fetchBlockData().then((response) => {
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
    const blocks = []
    let block = await provider.getBlock()
    blocks.push(block)
    for(let i=1; i< blockCount; i++){
      block = await provider.getBlock(block.number-1)
      blocks.push(block)
    }
    return processBlockData(blocks)
  }

  const processBlockData = (blocksArr) => {
    for (let block of blocksArr) {
      let tableRow = {
        num: blockObj.number,
        timestamp: blockObj.timestamp,
        txs: blockObj.transactions.length,
        miner: blockObj.miner,
        gasUsed: blockObj.gasUsed._hex,
        gasLimit: blockObj.gasLimit._hex,
      }
        
    }
    return tableRow
  }

  const onBlockSelect = (block) => {}

  return (
    <div>
      <h5>
        <ul>
          <li>Gas Price: {headerData && headerData.gasPrice} gwei</li>
          <li>Blockchain: {headerData && headerData.chainId} </li>
        </ul>
      </h5>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple-table'>
          <TableHead>
            <TableRow>
              {tHeads.map((title) => (
                <TableCell key={tHeads.indexOf(title)}>{title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell>{blockData && blockData.num}</TableCell>
            <TableCell>{blockData && blockData.timestamp}</TableCell>
            <TableCell>{blockData && blockData.txs}</TableCell>
            <TableCell>{blockData && blockData.miner}</TableCell>
            <TableCell>{blockData && blockData.gasUsed}</TableCell>
            <TableCell>{blockData && blockData.gasLimit}</TableCell>

            {/* {blockData.length > 0 &&
              blockData.map((val) => (
                <TableRow
                  key={val.num}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{val.num}</TableCell>
                  <TableCell>CRAP</TableCell>

                </TableRow>
              ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
