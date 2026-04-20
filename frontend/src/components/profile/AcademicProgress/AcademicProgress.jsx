import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/**
 * AcademicProgress Component - Minimalist Design
 * 
 * Displays GPA trends and credit progress
 */

const AcademicProgress = ({ student, progressRecords = [], courses = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        textAlign: 'center',
        color: '#999'
      }}>
        <p>Loading academic progress...</p>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const currentGPA = student.gpa || 0;
  const credits = student.creditsCompleted || 0;
  const totalCreditsRequired = 120;
  const creditPercentage = Math.round((credits / totalCreditsRequired) * 100);
  
  // Determine GPA status and color
  let gpaStatus = 'Average';
  let gpaColor = '#FF9800';
  if (currentGPA >= 3.7) {
    gpaStatus = 'Excellent';
    gpaColor = '#4CAF50';
  } else if (currentGPA >= 3.5) {
    gpaStatus = 'Very Good';
    gpaColor = '#66BB6A';
  } else if (currentGPA >= 3.0) {
    gpaStatus = 'Good';
    gpaColor = '#2196F3';
  } else if (currentGPA < 2.5) {
    gpaStatus = 'Below Average';
    gpaColor = '#F44336';
  }

  // Prepare chart data from progressRecords
  const chartData = progressRecords
    .map((record) => ({
      semester: `Sem ${record.semester}`,
      year: record.academicYear,
      gpa: parseFloat(record.gpa) || 0,
      credits: record.creditsEarned || 0,
      status: record.status,
    }))
    .reverse() // Show oldest first
    .slice(0, 10); // Limit to 10 semesters

  // Credit completion data for pie chart
  const creditProgressData = [
    { name: 'Completed', value: credits },
    { name: 'Remaining', value: Math.max(0, totalCreditsRequired - credits) }
  ];

  const COLORS = ['#4CAF50', '#E8E8E8'];

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      padding: '32px',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <h2 style={{
        fontSize: '22px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '0',
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '24px' }}>📚</span>
        Academic Progress
      </h2>

      {/* GPA Trend Chart - Full Width at Top */}
      {chartData.length > 1 && (
        <div style={{ marginTop: '32px', marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#999',
            marginBottom: '16px',
            marginTop: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>📈 GPA Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="semester" 
                stroke="#ccc"
                style={{ fontSize: '12px', color: '#999' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[2.5, 4]} 
                stroke="#ccc"
                style={{ fontSize: '12px', color: '#999' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => {
                  const record = chartData.find(d => d.semester === label);
                  return `${label} AY ${record?.year}`;
                }}
                cursor={{ stroke: '#667eea', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="#667eea" 
                dot={{ fill: '#667eea', r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                strokeWidth={3}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom Section: Credit Progress + Status Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginTop: chartData.length > 1 ? '32px' : 0
      }}>
        {/* Credit Progress Card */}
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#999',
            marginBottom: '20px',
            marginTop: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>📊 Credit Progress</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={creditProgressData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {creditProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '20px' }}>
            <p style={{
              margin: '0 0 6px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#4CAF50'
            }}>{creditPercentage}%</p>
            <p style={{
              margin: '0 0 18px 0',
              fontSize: '12px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>complete</p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '12px',
              paddingTop: '14px',
              borderTop: '1px solid #e8e8e8'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>{credits}</div>
                <div style={{ color: '#999', marginTop: '4px' }}>Remaining</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#333' }}>{totalCreditsRequired}</div>
                <div style={{ color: '#999', marginTop: '4px' }}>Required</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '12px',
          padding: '24px',
          border: `2px solid ${gpaColor}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{
              margin: '0 0 12px 0',
              fontSize: '12px',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Current GPA</p>
            
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '48px',
              fontWeight: '700',
              color: gpaColor,
              lineHeight: '1'
            }}>{currentGPA.toFixed(2)}</p>
            
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: gpaColor,
              fontWeight: '600'
            }}>{gpaStatus}</p>
          </div>

          <div style={{ 
            marginTop: '24px', 
            paddingTop: '18px', 
            borderTop: '1px solid #e8e8e8'
          }}>
            <div style={{ marginBottom: '18px' }}>
              <p style={{
                margin: '0 0 6px 0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Courses Completed</p>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#333'
              }}>{student.coursesCompleted || courses.length || 'N/A'}</p>
              
              {/* Display courses list */}
              {courses && courses.length > 0 && (
                <div style={{
                  marginTop: '10px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px',
                  padding: '10px'
                }}>
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#666',
                    textTransform: 'uppercase'
                  }}>📚 Your Courses:</p>
                  {courses
                    .filter(course => !student.major || course.major === student.major)
                    .map((course, idx) => (
                    <div key={idx} style={{
                      padding: '6px 8px',
                      marginBottom: '4px',
                      backgroundColor: '#fff',
                      borderLeft: '3px solid #667eea',
                      borderRadius: '3px',
                      fontSize: '11px',
                      color: '#333'
                    }}>
                      <span style={{ fontWeight: '600' }}>{course.code}</span> - {course.name}
                      {course.grade && <span style={{ color: '#667eea', marginLeft: '8px' }}>Grade: {course.grade}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p style={{
                margin: '0 0 6px 0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Major GPA</p>
              <p style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#333'
              }}>{student.majorGPA?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {chartData.length <= 1 && (
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '12px',
          padding: '48px 32px',
          textAlign: 'center',
          color: '#999',
          border: '1px solid #f0f0f0',
          marginTop: '24px'
        }}>
          <p style={{ margin: '0', fontSize: '13px', fontWeight: '500' }}>
            📚 GPA: {currentGPA.toFixed(2)} ({gpaStatus})
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#bbb' }}>
            Semester history will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default AcademicProgress;