import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import ExamPage from './pages/ExamPage'
import LessonPage from './pages/LessonPage'
import Think from './pages/Think'
import ExperimentPage from './pages/ExperimentPage'
import Knowledge from './pages/Knowledge'
import PhilosopherPage from './pages/PhilosopherPage'
import ConceptPage from './pages/ConceptPage'
import MapPage from './pages/MapPage'
import Profile from './pages/Profile'

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <div className="ambient-bg" />
      <div className="grid-overlay" />
      <ScrollReset />
      <div className="app-shell pb-nav">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/exam/:id" element={<ExamPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/think" element={<Think />} />
          <Route path="/experiment/:id" element={<ExperimentPage />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/philosopher/:id" element={<PhilosopherPage />} />
          <Route path="/concept/:id" element={<ConceptPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Layout />
    </>
  )
}
