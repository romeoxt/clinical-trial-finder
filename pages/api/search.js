import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { condition, location, status } = req.query;

  if (!condition) {
    return res.status(400).json({ message: 'Condition is required' });
  }

  const conditionEncoded = encodeURIComponent(condition);
  const locationEncoded = location ? encodeURIComponent(location) : '';
  
  // Format the status parameter according to ClinicalTrials.gov API requirements
  let statusFilter = '';
  if (status) {
    // Convert status to the format expected by the API
    const statusMap = {
      'RECRUITING': 'RECRUITING',
      'NOT_YET_RECRUITING': 'NOT_YET_RECRUITING',
      'ACTIVE_NOT_RECRUITING': 'ACTIVE_NOT_RECRUITING',
      'COMPLETED': 'COMPLETED',
      'TERMINATED': 'TERMINATED',
      'WITHDRAWN': 'WITHDRAWN',
      'SUSPENDED': 'SUSPENDED'
    };
    
    const apiStatus = statusMap[status];
    if (apiStatus) {
      statusFilter = `&filter.overallStatus=${encodeURIComponent(apiStatus)}`;
    }
  }

  // Using the correct parameters for ClinicalTrials.gov API
  const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${conditionEncoded}${locationEncoded ? `&query.locn=${locationEncoded}` : ''}${statusFilter}&fields=BriefTitle,NCTId,OverallStatus,LocationFacility,BriefSummary,Condition,StudyType,Phase,EnrollmentCount,StartDate,CompletionDate&pageSize=10`;

  try {
    console.log('Requesting URL:', url); // Debug log
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2)); // Debug log
    
    // Ensure we have a valid response structure
    if (!data || !Array.isArray(data.studies)) {
      console.error('Invalid response structure:', data); // Debug log
      throw new Error('Invalid response format from ClinicalTrials.gov');
    }

    // Filter out any studies without an NCTId and format the data
    const validStudies = data.studies
      .filter(study => study.protocolSection?.identificationModule?.nctId)
      .map(study => {
        const protocol = study.protocolSection;
        const identification = protocol.identificationModule;
        const status = protocol.statusModule;
        const description = protocol.descriptionModule;
        const conditions = protocol.conditionsModule;
        const design = protocol.designModule;
        const locations = protocol.contactsLocationsModule?.locations || [];

        return {
          NCTId: identification.nctId,
          BriefTitle: identification.briefTitle,
          OverallStatus: status.overallStatus,
          StartDate: status.startDateStruct?.date || null,
          CompletionDate: status.completionDateStruct?.date || null,
          BriefSummary: description.briefSummary,
          Condition: conditions.conditions?.[0] || null,
          StudyType: design.studyType,
          Phase: design.phases?.[0] || null,
          EnrollmentCount: design.enrollmentInfo?.count || null,
          LocationFacility: locations[0]?.facility || null
        };
      });
    
    console.log('Processed studies:', validStudies.length); // Debug log
    
    res.status(200).json({ 
      studies: validStudies,
      totalCount: data.totalCount || validStudies.length,
      nextPageToken: data.nextPageToken || null
    });
  } catch (error) {
    console.error('Error fetching clinical trials:', error);
    res.status(500).json({ 
      message: 'Error fetching clinical trials',
      error: error.message 
    });
  }
} 