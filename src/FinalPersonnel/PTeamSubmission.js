import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Container, FloatingLabel, Card } from 'react-bootstrap';
import { TbEdit } from "react-icons/tb";
import PNavbar from './PNavbar.js';

function PTeamSubmission() {
  const teamid = sessionStorage.getItem("team_id");
  const milestoneid = sessionStorage.getItem("milestone_id");
  const [submissions, setSubmissions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [selectedSubmission, setSelectedSubmission] = useState(null); 
  const [submissionLink, setSubmissionLink] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/viewteamsubmission/${teamid}/${milestoneid}`);
      const data = await response.json();
      setSubmissions(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/displaytopic/${milestoneid}`);
      const data = await response.json();
      setTopics(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchTopics();
  }, []);

  const findSubmissionDetails = (topic) => {
    return submissions.find(submission => submission.topic_id === topic.topic_id) || {
      submission_link: "",
      status: "",
      comment: ""
    };
  };

  const handleEditModalOpen = (submission) => {
    setSelectedSubmission(submission);
    setSubmissionLink(submission.submission_link);
    setStatus(submission.status);
    setComment(submission.comment);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedSubmission(null);
    setSubmissionLink("");
    setStatus("");
    setComment("");
  };

  const handleSubmissionUpdate = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/updatesubmission/${selectedSubmission.submission_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          milestone_id: milestoneid,
          topic_id: selectedSubmission.topic_id,
          submission_link: submissionLink,
          team_id: teamid,
          status: status,
          comment: comment,
        }),
      });
      fetchSubmissions();
      handleEditModalClose();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  return (
    <>
      <PNavbar />
      <Container className="d-flex justify-content-center">
        <h1 className="title-text mt-5 mb-4">Submissions</h1>
      </Container>
      <Container>
        <Card className="submissions">
          <Card.Body>
            <Table bordered hover>
            <thead className="card-header">
              <tr>
                <th>Topic Name</th>
                <th>Submission Link</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => {
                const submissionDetails = findSubmissionDetails(topic);
                const isSubmissionNull = submissionDetails.submission_link === "" && submissionDetails.status === "" && submissionDetails.comment === "";
                return (
                  <tr key={topic.topic_id}>
                    <td>{topic.topic_name}</td>
                    <td>{submissionDetails.submission_link}</td>
                    <td>{submissionDetails.status}</td>
                    <td>{submissionDetails.comment}</td>
                    <td>
                      {!isSubmissionNull && (
                        <Button onClick={() => handleEditModalOpen(submissionDetails)} className="login-button">
                          <TbEdit />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title className="fw-bold title-text">Edit Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="submissionLinkInput" className="mb-3">
            <FloatingLabel controlId="submissionLinkInput" label="Submission Link">
              <Form.Control 
                type="text" 
                value={submissionLink} 
                onChange={(e) => setSubmissionLink(e.target.value)} 
                placeholder=""
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="statusSelect" className="mb-3">
            <FloatingLabel controlId="statusSelect" label="Status">
              <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="on-going">On-Going</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Control>
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="commentInput" className="mb-3">
            <FloatingLabel controlId="commentInput" label="Comment">
              <Form.Control as="textarea" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="" />
            </FloatingLabel>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="outline-secondary" onClick={handleEditModalClose} className="fw-bold p-3 w-25">Close</Button>
          <Button variant="primary" onClick={handleSubmissionUpdate} className="login-button fw-bold p-3 w-25">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PTeamSubmission;
