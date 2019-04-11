import React, { Component } from "reactn";
import { Modal, Button, Item, List } from 'semantic-ui-react';
import {Header as SemanticHeader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
const actions = require('../helpers/singleDocActions');
const single = require('../helpers/singleDoc');
const share = require('../helpers/shareDoc');
const docCol = require('../helpers/docsCollectionShare');


export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      modalTwoOpen: false,
      visible: false
    }
  }

  doCommand = (props) => {
    if(props === 'undo') {
      window.document.execCommand('undo')
    } else if(props === 'redo') {
      window.document.execCommand('redo')
    } else if(props === 'copy') {
      console.log('copy')
      window.document.execCommand('copy')
    }
  }

  shareDoc = (params) => {
    docCol.sharedInfo(params)
    this.setState({modalOpen: false})
  }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  handleClose = () => this.setState({ versionModal: false });

  handleVersionSelect = async (id) => {
    await single.loadVersion(id);
    this.setState({ versionModal: false })
  }

  render() {
    const linkHref = '';
    const { contacts, teamList, gaiaLink, singleDocIsPublic, readOnly, singleDoc } = this.global;
    let versions;
    if(singleDoc.versions) {
      versions = singleDoc.versions;
    } else {
      versions = [];
    }
    let deleteLink;
    if (window.location.href.includes('new')) {
      deleteLink = `/documents/delete/${window.location.href.split('new/')[1]}`
    } else {
      deleteLink = `/documents/delete/${window.location.href.split('documents/')[1]}`
    }
    return (

              <div className="cm-e-menu">
                  <ul>
                      <li className="topmenu">
                          <a href={linkHref}>file</a>
                          <ul className="submenu">
                              <li><button className='link-button' href={`${window.location.origin}/documents/new/${Date.now()}`} target='_blank' rel="noopener noreferrer">New Document</button></li>
                              {/*<li><a>Add tag</a></li>*/}
                              <li className="divider-menu"><hr /></li>
                              
                              <li><button className='link-button'><Link to={deleteLink}>Delete</Link></button></li>
                              <li className="divider-menu"><hr /></li>
                              <li>
                                  <button className='link-button'>Download</button>
                                  <ul className="submenu">
                                      <li><button className='link-button' onClick={() => actions.downloadDoc('word')}>Microsoft Word (.docx)</button></li>
                                      {/*<li><a onClick={() => this.props.downloadDoc('odt')}>OpenDocument (.odt)</a></li>
                                      <li><a onClick={() => this.props.downloadDoc('rtf')}>Rich Text (.rtf)</a></li>*/}
                                      <li><button className='link-button' onClick={() => actions.downloadDoc('txt')}>Plain Text (.txt)</button></li>
                                      <li><button className='link-button' onClick={() => actions.downloadDoc('pdf')}>PDF (.pdf)</button></li>

                                  </ul>
                              </li>
                              <li><button className='link-button' onClick={actions.print}>Print</button></li>
                          </ul>
                      </li>
                      { this.global.mediumConnected ? Object.keys(this.global.mediumConnected).length > 0 && this.global.graphitePro ?
                        <li className="topmenu">
                          <a href={linkHref}>Export</a>
                          <ul className="submenu">
                            <li><a href={linkHref}>Post to Medium</a></li>
                          </ul>
                        </li> :
                        <li className="hide"></li> : <li className="hide"></li>
                      }


                      <li className="topmenu">
                      <a href={linkHref}>Share</a>
                      <ul className="submenu">
                          <li>
                            <Modal closeIcon style={{borderRadius: "0"}}
                              trigger={<button className='link-button'>Public link</button>}>
                              <Modal.Header style={{fontFamily: "Muli, san-serif", fontWeight: "200"}}>Share Publicly</Modal.Header>
                              <Modal.Content>
                                <Modal.Description>
                                  <h3>Search for a contact</h3>
                                  <p>This data is not encrypted and can be accessed by anyone with the link that will be generated.</p>
                                  {
                                    singleDocIsPublic === true ?
                                    <div>
                                      <p style={{marginBottom: "15px"}}>This document is already being shared publicly.</p>

                                      <Button style={{ borderRadius: "0" }} onClick={single.toggleReadOnly} color="green">{readOnly === true ? "Make Editable" : "Make Read-Only"}</Button>
                                      <Button style={{ borderRadius: "0" }} onClick={single.stopSharing} color="red">Stop Sharing Publicly</Button>
                                      <p style={{marginTop: "15px", marginBottom: "15px"}}>
                                        {readOnly === true ? "This shared document is read-only." : "This shared document is editable."}
                                      </p>
                                    </div>
                                    :
                                    <Button style={{ borderRadius: "0" }} secondary onClick={share.sharePublicly}>Share Publicly</Button>
                                  }

                                  {
                                    gaiaLink !== "" ?
                                    <div>
                                      <p><a href={gaiaLink}>{gaiaLink}</a></p>
                                    </div>
                                    :
                                    <div className="hide" />
                                  }
                                </Modal.Description>
                              </Modal.Content>
                            </Modal>

                          </li>
                          {
                            this.global.graphitePro ? <li>
                            <Modal closeIcon style={{borderRadius: "0"}}
                              trigger={<button className='link-button'>Share with team</button>}>
                              <Modal.Header style={{fontFamily: "Muli, san-serif", fontWeight: "200"}}>Share With Team</Modal.Header>
                              <Modal.Content>
                                <Modal.Description>
                                  <h3>Search for a contact</h3>
                                  <p>By sharing with your entire team, each teammate will have immediate access to the document and will be able to collaborate in real-time.</p>
                                  <p>For reference, you can see your list of teammates below:</p>
                                  <Item.Group divided>
                                  {teamList.map(mate => {
                                      return (
                                          <Item className="contact-search" key={mate.name}>
                                          <Item.Content verticalAlign='middle'>{mate.email}
                                          <br/>
                                          {mate.role}
                                          </Item.Content>
                                          </Item>
                                          )
                                        }
                                      )
                                  }
                                  </Item.Group>
                                  <Button secondary style={{borderRadius: "0"}} onClick={single.shareToTeam}>Share</Button>
                                </Modal.Description>
                              </Modal.Content>
                            </Modal>
                            </li> :
                            <li className="hide"></li>
                          }
                          {
                            this.global.teamDoc && this.global.userRole === "User" ?
                            <li className="hide">Share</li> :
                            <li>
                            <Modal
                              closeIcon
                              style={{borderRadius: "0"}}
                              trigger={<button className='link-button' onClick={() => this.setState({ modalOpen: true})}>Share with contact</button>}
                              open={this.state.modalOpen}
                              closeOnEscape={true}
                              closeOnDimmerClick={true}
                              onClose={() => this.setState({ modalOpen: false})}
                              >
                              <Modal.Header style={{fontFamily: "Muli, san-serif", fontWeight: "200"}}>Share Document</Modal.Header>
                              <Modal.Content>
                                <Modal.Description>
                                  {/*<h3>Search for a contact</h3>
                                  
                                  <Input icon='users' iconPosition='left' placeholder='Search users...' onChange={cont.handleNewContact} />
                                  <Item.Group divided>
                                  {results.map(result => {
                                    let profile = result.profile;
                                    let image = profile.image;
                                    let imageLink;
                                    if(image !=null) {
                                      if(image[0]){
                                        imageLink = image[0].contentUrl;
                                      } else {
                                        imageLink = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
                                      }
                                    } else {
                                      imageLink = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
                                    }

                                      return (
                                          <Item className="contact-search" key={result.username}>
                                          <Item.Image size='tiny' src={imageLink} />
                                          <Item.Content verticalAlign='middle'>{result.username} <br/>
                                            <Modal closeIcon style={{borderRadius: "0"}}
                                              trigger={<Button onClick={() => this.handleShare(result.fullyQualifiedName) } color='green' style={{borderRadius: "0"}}>Share</Button>}>
                                              <Modal.Header style={{fontFamily: "Muli, san-serif", fontWeight: "200"}}>Share Publicly</Modal.Header>
                                              <Modal.Content>
                                                <Modal.Description>
                                                  <h3>Shared!</h3>
                                                  <p>Here is the link you can provide with the person you shared with for quick access: </p>
                                                  <p style={{wordWrap: "break-word"}}>{window.location.origin + '/documents//single/shared/' + loadUserData().username + window.location.href.split('doc/')[1]}</p>
                                                </Modal.Description>
                                              </Modal.Content>
                                            </Modal>
                                            <Modal closeIcon style={{borderRadius: "0"}}
                                              trigger={<Button onClick={() => single.sharedInfoSingleDocStatic(result.fullyQualifiedName) } color='blue' style={{borderRadius: "0"}}>Share Read-Only</Button>}>
                                              <Modal.Header style={{fontFamily: "Muli, san-serif", fontWeight: "200"}}>Share Publicly</Modal.Header>
                                              <Modal.Content>
                                                <Modal.Description>
                                                  <h3>Shared!</h3>
                                                  <p>Here is the link you can provide with the person you shared with for quick access: </p>
                                                  <p style={{wordWrap: "break-word"}}>{window.location.origin + '/documents//single/shared/' + loadUserData().username + window.location.href.split('doc/')[1]}</p>
                                                </Modal.Description>
                                              </Modal.Content>
                                            </Modal>

                                          </Item.Content>
                                          </Item>
                                          )
                                        }
                                      )
                                      }
                                  </Item.Group>
                                    <hr />*/}
                                  <Item.Group divided>
                                  <h4>Your Contacts</h4>
                                  {contacts.slice(0).reverse().map(contact => {
                                    return (
                                      <Item className="contact-search" key={contact.contact}>
                                        <Item.Image size='tiny' src={contact.img} />
                                        <Item.Content verticalAlign='middle'>{contact.contact} <br/> <Button onClick={() => this.shareDoc({contact: contact, doc: singleDoc, realTime: true })} color='green' style={{borderRadius: "0"}}>Share</Button><Button onClick={() => this.shareDoc({contact: contact, doc: singleDoc, realTime: false })} color='blue' style={{borderRadius: "0"}}>Share Read-Only</Button></Item.Content>
                                      </Item>
                                    )
                                  })
                                }
                                </Item.Group>
                                </Modal.Description>
                              </Modal.Content>
                            </Modal>
                            </li>
                          }
                      </ul>
                      </li>
                      <li className="topmenu">
                          <a href={linkHref}>Info</a>
                          <ul className="submenu">
                            <Modal closeIcon trigger={<li><a href={linkHref}>Shortcuts & Markdown Guide</a></li>}>
                            <Modal.Header>Shortcuts & Markdown Guide</Modal.Header>
                              <Modal.Content>
                                <Modal.Description>
                                  <SemanticHeader>Basic Syntax</SemanticHeader>
                                  <ul>
                                    <li><span><h2>Headings</h2></span> <span><pre> # Headings</pre></span></li>
                                    <li><span>New Paragraph</span> <span> <pre>Hit "return" twice</pre></span></li>
                                    <li><span>Blockquote</span><span> <pre>">" then hit space</pre></span></li>
                                    {/*<li><span>Hyperlinked <a>text</a></span> <span><pre>[text](http://www.link.com)</pre></span></li>*/}
                                    <li><span><em>Italicize</em></span> <span><pre>"_" then hit space</pre></span></li>
                                    {/*<li><span><strong>Bold</strong></span> <span><pre>**Bold**</pre></span></li>*/}
                                    {/*<li><span>Ordered lists</span> <span><pre><br/>1. Item One <br/> 2. Item Two</pre></span></li>*/}
                                    <li><span>Unordered lists</span> <span><pre>"*" then hit space</pre></span></li>
                                    <li><span>Check lists</span> <span><pre>"[]" then hit space</pre></span></li>
                                  </ul>
                                  <p>Learn more <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">here.</a></p>
                                </Modal.Description>
                              </Modal.Content>
                            </Modal>
                              <li><a href="https://github.com/Graphite-Docs/graphite" target="_blank" rel="noopener noreferrer">github</a></li>
                              <li><a href="https://graphitedocs.com/about" target="_blank" rel="noopener noreferrer">about</a></li>
                              <li className="divider-menu"><hr /></li>
                              <li><a href="https://github.com/Graphite-Docs/graphite/issues" target="_blank" rel="noopener noreferrer">bug report</a></li>
                          </ul>
                      </li>
                      <li className="topmenu">
                      <Modal
                        open={this.state.versionModal}
                        onClose={this.handleClose}
                        closeIcon
                        closeOnEscape={true}
                        closeOnDimmerClick={true}
                        style={{borderRadius: "0"}}
                        trigger={<button className='link-button' onClick={() => this.setState({ versionModal: true })}>History</button>}>
                        <Modal.Header style={{fontFamily: "Muli, san-serif", fontWeight: "200"}}>Document History</Modal.Header>
                        <Modal.Content>
                          <Modal.Description>
                            <h3>View History or Revert to a Past Version</h3>
                            <List divided relaxed>
                              {
                                versions.slice(0).reverse().map(version => {
                                  let timestamp = new Date(version.timestamp).getTime();
                                  let newDate = new Date();
                                  newDate.setTime(timestamp);
                                  let dateString = newDate.toUTCString();
                                  return (
                                    <List.Item key={version.version}>
                                      <List.Icon name='clock outline' size='large' verticalAlign='middle' />
                                      <List.Content>
                                        <List.Header as='a' onPointerDown={(e) => this.handleVersionSelect(version.version)}>Version {versions.indexOf(version) + 1}</List.Header>
                                        <List.Description as='a'>Created at {dateString}</List.Description>
                                      </List.Content>
                                    </List.Item>
                                  )
                                })
                              }
                            </List>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                      </li>
                      {/*<li className="topmenu">
                          <a>Page settings</a>
                          <ul className="submenu">
                              <li><a onClick={() => this.props.formatSpacing('single')}>Single Space</a></li>
                              <li onClick={() => this.props.formatSpacing('double')}><a>Double Space</a></li>
                          </ul>
                      </li>*/}
                  </ul>
              </div>
    );
  }
}