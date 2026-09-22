import React, { useState, useEffect } from 'react'
import '../css/Notification.css'
import { Bell, Calendar, MapPin, Tag, Clock, GraduationCap, Trash2, AlertTriangle, X } from 'lucide-react'

const Notification = ({ typeUser = "" }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // In-Page Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch Notifications
  const fetchNotifications = () => {
    setLoading(true)
    fetch('http://localhost:5000/getNotification')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setNotifications(data.notifications)
        } else {
          setNotifications([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err)
        setNotifications([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Open Delete Confirmation Modal
  const openDeleteModal = (notification) => {
    setNotificationToDelete(notification)
    setDeleteModalOpen(true)
  }

  // Close Delete Modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setNotificationToDelete(null)
  }

  // Confirm and Execute Delete via Backend API
  const confirmDelete = async () => {
    if (!notificationToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`http://localhost:5000/deleteNotification/${notificationToDelete.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (response.ok && data.status === 'success') {
        setNotifications((prev) => prev.filter((item) => item.id !== notificationToDelete.id))
        closeDeleteModal()
      } else {
        alert(data.message || "Failed to delete notification")
      }
    } catch (err) {
      console.error("Error deleting notification:", err)
      alert("Server connection failed while deleting notification")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="NotificationMainCard">
        <div className="NotificationHeader">
          <div className="NotificationHeaderTitle">
            <Bell size={22} className="NotificationHeaderIcon" />
            <h2>College Notifications</h2>
          </div>
        </div>
        <div className="NoNotificationArea">
          <p>Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="NotificationMainCard">
      {/* Fixed Header */}
      <div className="NotificationHeader">
        <div className="NotificationHeaderTitle">
          <Bell size={22} className="NotificationHeaderIcon" />
          <h2>College Notifications</h2>
        </div>
        <span className="NotificationBadgeCount">{notifications.length} Updates</span>
      </div>

      {/* Internal Scrollable Content Area */}
      <div className="NotificationScrollArea">
        {notifications.length === 0 ? (
          <div className="NoNotificationArea">
            <p>No notifications available</p>
          </div>
        ) : (
          <div className="NotificationGrid">
            {notifications.map((item, index) => (
              <div key={item.id || index} className="NotificationCard">
                <div className="NotificationCardTop">
                  <div className="NotificationBadgesGroup">
                    <span className="NotificationCategory">
                      <Tag size={12} />
                      {item.category}
                    </span>

                    {item.semester && (
                      <span className="NotificationSemester">
                        <GraduationCap size={12} />
                        {item.semester}
                      </span>
                    )}

                    {item.isNew && <span className="NotificationNewBadge">New</span>}
                  </div>

                  {/* Faculty Only Delete Button */}
                  {typeUser === 'faculty' && (
                    <button 
                      className="NotificationDeleteBtn" 
                      onClick={() => openDeleteModal(item)}
                      title="Delete Notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <h3 className="NotificationTitle">{item.title}</h3>
                <p className="NotificationDescription">{item.description}</p>

                <div className="NotificationFooter">
                  <div className="NotificationMeta">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </div>

                  {item.time && (
                    <div className="NotificationMeta">
                      <Clock size={14} />
                      <span>{item.time}</span>
                    </div>
                  )}

                  <div className="NotificationMeta">
                    <MapPin size={14} />
                    <span>{item.venue || item.location || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom In-Page Delete Modal */}
      {deleteModalOpen && (
        <div className="notificationModalOverlay">
          <div className="notificationModalCard">
            <button className="notificationModalCloseBtn" onClick={closeDeleteModal}>
              <X size={18} />
            </button>
            <div className="notificationModalIcon">
              <AlertTriangle size={28} />
            </div>
            <h3>Delete Notification?</h3>
            <p>
              Are you sure you want to delete <strong>"{notificationToDelete?.title}"</strong>? This action cannot be undone.
            </p>
            <div className="notificationModalActions">
              <button 
                className="notificationCancelBtn" 
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="notificationConfirmDeleteBtn" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification