/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import Dropzone from 'react-dropzone'
import { parse } from 'papaparse'
import choloApi from '../../choloApi'

const useStyles = makeStyles(theme => ({
  dropzoneStyle: {
    width: '200px',
    height: '30px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    margin: '0 auto',
  },
  dropZoneSection: {
    left: '200px',
    marginLeft: '15px',
    bottom: '1px',
    float: 'left',
    height: '30px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
  dropzoneText: {
    color: theme.common.white,
    cursor: 'pointer',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '4px',
  },
}))

const formatDataForBatchUpload = arr => {
  return JSON.stringify(
    arr.map(i => {
      return {
        ...i,
        busstop_objectId: i.busstop_objectId && i.busstop_objectId.split(','),
      }
    })
  )
}

const BusRoutesBatchUpload = ({ onBatchUpload }) => {
  const globalStore = useSelector(state => state.globalStore)
  const dispatch = useDispatch()
  const classes = useStyles()
  // const [batchUploadedData, setBatchUploadedData] = useState([])

  // Function to use the browser's FileReader api to capture the uploaded file
  const onDrop = files => {
    const file = files[0]
    if (file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = async () => {
        const csv = reader.result
        const {
          data,
          meta: { fields },
        } = parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        })

        try {
          if (globalStore.ifBusStopTableShouldRender) {
            await choloApi.createBusStopsBatchUpload(data)
            onBatchUpload()
          } else {
            await choloApi.createBusRouteBatchUpload(formatDataForBatchUpload(data))
            // await choloApi.createBusRouteBatchUpload(data)
            onBatchUpload()
          }
        } catch (e) {
          console.log('Error in batch uploading data')
        }
      }
      reader.onabort = () => alert('File reading was aborted.')
      reader.onerror = () => alert('File reading has failed.')
      reader.readAsBinaryString(file)
    }
  }

  return (
    <>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section className={classes.dropZoneSection}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Typography className={classes.dropzoneText} variant="body1">
                Choose File for Batch Upload
              </Typography>
            </div>
          </section>
        )}
      </Dropzone>
    </>
  )
}

BusRoutesBatchUpload.propTypes = {
  onBatchUpload: PropTypes.func.isRequired,
}

export default BusRoutesBatchUpload
