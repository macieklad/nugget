import React from 'react'

import BpmnJS from 'bpmn-js/lib/Modeler'

export interface BpmnViewerProps {
  diagramXML?: string
  url: string
  onShown?: (warnings: any) => {}
  onLoading?: () => {}
  onError?: (err: Error) => {}
  onSetViewer?: (viewer: any) => any
}

export interface BpmnViewerState {
  diagramXML?: string
}

export default class BpmnViewer extends React.Component<
  BpmnViewerProps,
  BpmnViewerState
> {
  containerRef: React.RefObject<any>
  bpmnViewer: any

  constructor(props: BpmnViewerProps) {
    super(props)

    this.state = {}

    this.containerRef = React.createRef()
  }

  componentDidMount() {
    const { url, diagramXML } = this.props

    const container = this.containerRef.current

    this.bpmnViewer = new BpmnJS({ container })
    if (this.props.onSetViewer) {
      this.props.onSetViewer(this.bpmnViewer)
    }

    this.bpmnViewer.on('import.done', (event: any) => {
      const { error, warnings } = event

      if (error) {
        return this.handleError(error)
      }

      this.bpmnViewer.get('canvas').zoom('fit-viewport', 'auto')

      return this.handleShown(warnings)
    })

    if (url) {
      return this.fetchDiagram(url)
    }

    if (diagramXML) {
      return this.displayDiagram(diagramXML)
    }
  }

  componentWillUnmount() {
    this.bpmnViewer.destroy()
  }

  componentDidUpdate(prevProps: BpmnViewerProps, prevState: any) {
    const { props, state } = this

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url)
    }

    const currentXML = props.diagramXML || state.diagramXML

    const previousXML = prevProps.diagramXML || prevState.diagramXML

    if (currentXML && currentXML !== previousXML) {
      return this.displayDiagram(currentXML)
    }
  }

  displayDiagram(diagramXML: string) {
    this.bpmnViewer.importXML(diagramXML)
  }

  fetchDiagram(url: string) {
    this.handleLoading()

    fetch(url)
      .then((response) => response.text())
      .then((text) => this.setState({ diagramXML: text }))
      .catch((err) => this.handleError(err))
  }

  handleLoading() {
    const { onLoading } = this.props

    if (onLoading) {
      onLoading()
    }
  }

  handleError(err: Error) {
    const { onError } = this.props

    if (onError) {
      onError(err)
    }
  }

  handleShown(warnings: any) {
    const { onShown } = this.props

    if (onShown) {
      onShown(warnings)
    }
  }

  render() {
    return (
      <div
        className="canvas"
        style={{
          height: '100vh',
        }}
        ref={this.containerRef}
      ></div>
    )
  }
}
