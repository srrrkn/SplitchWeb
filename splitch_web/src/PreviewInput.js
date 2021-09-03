import React, { Component } from 'react';
import './PreviewInput.css';

export default class PreviewInput extends Component {

  constructor(props) {
      super(props)
      this.state = {
          imageData: null,
          splitImageIndex: 0,
          splitImageIndexRow:0,
          splitImageIndexCol:0,
          splitN: 0,
          gridLength:0,
          splitWidthN:0,
          splitHeightN:0,
          imageWidth:0,
          imageHeight:0,
      }
      this.fileInput = React.createRef()
  }

  
  onFileChange(e) {
    const files = e.target.files
    if(files.length > 0) {
        var file = files[0]
        var image = new Image()
        var reader = new FileReader()
        reader.onloadend = (e) => {
            this.setState({ imageData: e.target.result }) 
            image.src = e.target.result
            image.onload = (e) => {
                this.setState({ imageWidth: image.naturalWidth }) 
                this.setState({ imageHeight: image.naturalHeight }) 
            }
            this.loadImage(8)
        }
        reader.readAsDataURL(file)
    } else {
        this.setState({ imageData: null })
    }
  }

  resetInput() {
      this.fileInput.current.value = ''
      this.setState({ imageData: null })
  }

  nextSplitImage(){
    this.setState({splitImageIndex:this.state.splitImageIndex++})
  }

  backSplitImage(){
    this.setState({splitImageIndex:this.state.splitImageIndex--})
  }

  clipImage(imageIndex){
    
  }

  loadImage(splitShortN){
    //画像サイズ取得
    var width = this.state.imageWidth;
    var height = this.state.imageHeight;

    //短辺の決定
    if(width <= height){
        var shortLength = width
        var longLength = height
        var shortDirection = "w"
    }else{
        var shortLength = height
        var longLength = width
        var shortDirection = "h"
    }

    //グリッドの1辺の長さ計算
    this.gridLength = shortLength / splitShortN

    //長辺の分割数計算
    if (parseInt(longLength / this.gridLength, 10) < (longLength / this.gridLength)){
        var splitLongN = parseInt(longLength / this.gridLength, 10) + 1
    }else {
        var splitLongN = parseInt(longLength / this.gridLength, 10)
    }

    //縦，横の分割数を設定
    if(shortDirection == "w"){
        this.splitWidthN = splitShortN
        this.splitHeightN = splitLongN
    }else{
        this.splitWidthN = splitLongN
        this.splitHeightN = splitShortN
    }

    //グリッド総数の計算
    this.state.splitN = splitShortN*splitLongN

    //現在の行、列設定
    this.state.splitImageIndexRow = parseInt((this.state.splitN-1)/this.state.splitWidthN, 10) + 1
    this.state.splitImageIndexCol = (this.state.splitN-1) % this.splitWidthN + 1
  }

  render() {
    const imageData = this.state.imageData
    const fileInput= React.createRef()
    let viewIndex = ''
    let preview = ''
    let resetButton = ''
    let nextButton = ''
    let backButton = ''
    if(imageData != null) {
        viewIndex = (
            <div><h1>{this.state.splitImageIndex}</h1></div>
        )
        preview = (
            <div class="img-fitter">
                <img src={imageData} class="split-image"/>
            </div>
        )
        resetButton = (
            <div>
                <button type="button" onClick={this.resetInput.bind(this)}>リセット</button>
            </div>
        )
        nextButton = (
            <div>
                <button type="button" onClick={this.nextSplitImage.bind(this)}>next</button>
            </div>
        )
        backButton = (
            <div>
                <button type="button" onClick={this.backSplitImage.bind(this)}>back</button>
            </div>
        )
    }
    return (
        <div>
            {viewIndex}
            <input type="file" accept="image/*" ref={this.fileInput} onChange={
                (e) => {
                    this.onFileChange(e)
                }
            } />
            {preview}
            {resetButton}
            {nextButton}
            {backButton}
        </div>
    )
  }
}