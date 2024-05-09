import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PNavbar from './PNavbar.js';
import { useNavigate } from 'react-router-dom';

function PDeliverables() {
  const [milestones, setMilestones] = useState([]);
  const [topics, setTopics] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [milestonePercentages, setMilestonePercentages] = useState({});
  const [completedMilestonesCount, setCompletedMilestonesCount] = useState(0);
  const teamid = sessionStorage.getItem("team_id");
  const navigate = useNavigate();

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/viewmilestone`);
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/viewtopic`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/displaysubmission/${teamid}`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchSubmissions();
    fetchTopics();
  }, []);

  useEffect(() => {
    const computeMilestonePercentages = () => {
      const percentages = {};
      let completedCount = 0;
      milestones.forEach(milestone => {
        const milestoneTopics = topics.filter(topic => topic.milestone_id === milestone.milestone_id);
        const milestoneSubmissions = submissions.filter(submission =>
          milestoneTopics.some(topic => topic.topic_id === submission.topic_id)
        );
        const percentage = milestoneTopics.length > 0 ?
          (milestoneSubmissions.length / milestoneTopics.length) * 100 : 0;
        percentages[milestone.milestone_id] = percentage;
        if (percentage === 100) {
          completedCount++;
        }
      });
      setMilestonePercentages(percentages);
      setCompletedMilestonesCount(completedCount);
    };
  
    computeMilestonePercentages();
  }, [milestones, topics, submissions]);

  const overallPercentage = milestones.length > 0 ? (completedMilestonesCount / milestones.length) * 100 : 0;

  const handleViewClick = (milestoneId) => {
    sessionStorage.setItem('milestone_id', milestoneId);
    navigate("/pviewsubmission");
    
  };

  return (
    <>
      <PNavbar />
      <Container>
        <Container className="mt-4 d-flex justify-content-center mb-4">
          <h2 className='title-text'>Team Milestone Overall Completion: {overallPercentage.toFixed(2)}%</h2>
        </Container>
        <Container className='d-flex flex-column justify-content-center gap-3 mb-5'>
            {milestones.map((milestone, index) => (
              <Card key={index}>
                <Card.Body className='p-4'>
                  <Card.Text>
                    <Row>
                      <Col>
                        <div className='mb-2 mt-4 d-flex justify-content-center fw-bold'>
                          <span className='title-text'>{milestone.milestone_name}</span>
                        </div>
                      </Col>
                      <Col>
                        <h6 className='justify-content-center d-flex fw-normal'>
                          {`${milestonePercentages[milestone.milestone_id] || 0}%`}
                        </h6>
                        <ProgressBar
                          animated now={milestonePercentages[milestone.milestone_id] || 0}
                          className='mt-2'
                          labelPlacement="top"
                        />
                      </Col>
                      <Col>
                        <div className='d-flex justify-content-center mt-4'>
                          <Button 
                            onClick={() => handleViewClick(milestone.milestone_id)}
                            className='fw-bold w-50 rounded-pill login-button'
                          >
                            View
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
        </Container>
      </Container>
    </>
  );
}

export default PDeliverables;
