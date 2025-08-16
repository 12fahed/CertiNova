"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Users, Calendar, FileText, Hash, Loader2, AlertCircle, ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react"
import { certificateService } from "@/services/certificate"
import { CertificateListItem } from "@/types/certificate"
import { toast } from "sonner"
import { PasswordDialog } from "@/components/password-dialog"
import { EncryptedCache } from "@/utils/crypto"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/context/AuthContext"

export default function CertificatesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateListItem | null>(null)
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("")
  
  // Data fetching states
  const [certificates, setCertificates] = useState<CertificateListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDecrypted, setIsDecrypted] = useState(false)
  
  // Password dialog states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)

  // Fetch certificates data (encrypted by default)
  const fetchCertificates = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      
      const response = await certificateService.getGeneratedCertificates({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        filter: filterBy as 'all' | 'recent' | 'high-recipients' | 'with-rank' | 'without-rank',
        sortBy: 'date',
        sortOrder: 'desc',
        generatedBy: user?.id
      })

      if (response.success && response.data) {
        setCertificates(response.data.certificates)
        setTotalPages(response.data.pagination.totalPages)
        setTotalCount(response.data.pagination.totalCount)
        setHasNextPage(response.data.pagination.hasNextPage)
        setHasPrevPage(response.data.pagination.hasPrevPage)
        
        // Check if data requires decryption
        if (response.data.requiresDecryption) {
          setIsDecrypted(false)
          toast.info("Password required for search", {
            description: "Enter your password to decrypt and search certificate data."
          })
        } else {
          setIsDecrypted(response.data.certificates[0]?.encrypted === false)
        }
      } else {
        throw new Error(response.message || 'Failed to fetch certificates')
      }
    } catch (err) {
      console.error('Error fetching certificates:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      setCertificates([])
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm, filterBy, user?.id])

  // Fetch decrypted certificates with password
  const fetchDecryptedCertificates = useCallback(async (password: string) => {
    try {
      setIsDecrypting(true)
      setError(null)
      
      const response = await certificateService.getDecryptedGeneratedCertificates({
        password,
        page: currentPage,
        limit: 10,
        search: searchTerm,
        filter: filterBy as 'all' | 'recent' | 'high-recipients' | 'with-rank' | 'without-rank',
        sortBy: 'date',
        sortOrder: 'desc',
        generatedBy: user?.id
      })

      if (response.success && response.data) {
        setCertificates(response.data.certificates)
        setTotalPages(response.data.pagination.totalPages)
        setTotalCount(response.data.pagination.totalCount)
        setHasNextPage(response.data.pagination.hasNextPage)
        setHasPrevPage(response.data.pagination.hasPrevPage)
        setIsDecrypted(true)
        
        // Cache password for future use
        const cache = EncryptedCache.getInstance()
        cache.setPassword(password)
        
        toast.success("Data decrypted successfully!", {
          description: `Found ${response.data.certificates.length} matching certificates.`
        })
      } else {
        throw new Error(response.message || 'Failed to decrypt certificates')
      }
    } catch (err) {
      console.error('Error decrypting certificates:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrypt data'
      setError(errorMessage)
      
      if (errorMessage.includes('password')) {
        toast.error("Invalid password", {
          description: "Please check your password and try again."
        })
      } else {
        toast.error(errorMessage)
      }
      
      setCertificates([])
    } finally {
      setIsDecrypting(false)
      setShowPasswordDialog(false)
    }
  }, [currentPage, searchTerm, filterBy, user?.id])

  // Handle password dialog confirmation
  const handlePasswordConfirm = (password: string) => {
    fetchDecryptedCertificates(password)
  }

  // Handle unlock button click
  const handleUnlockData = () => {
    setShowPasswordDialog(true)
  }

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  // Reset to first page when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchTerm, filterBy, currentPage])

  // Filter certificates is no longer needed as filtering is done on server
  const filteredCertificates = certificates

  // Filter recipients in modal
  const filteredRecipients = useMemo(() => {
    if (!selectedCertificate) return []

    return selectedCertificate.recipients.filter(
      (recipient) =>
        recipient.name.toLowerCase().includes(recipientSearchTerm.toLowerCase()) ||
        (recipient.email && recipient.email.toLowerCase().includes(recipientSearchTerm.toLowerCase())) ||
        (recipient.rank && recipient.rank.toLowerCase().includes(recipientSearchTerm.toLowerCase())) ||
        (recipient.uuid && recipient.uuid.toLowerCase().includes(recipientSearchTerm.toLowerCase())),
    )
  }, [selectedCertificate, recipientSearchTerm])

  const handleRecipientsClick = (certificate: CertificateListItem) => {
    setSelectedCertificate(certificate)
    setRecipientSearchTerm("")
  }

  const closeModal = () => {
    setSelectedCertificate(null)
    setRecipientSearchTerm("")
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar variant="certificate" />
        <div className="max-w-7xl mx-auto pt-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificates Dashboard</h1>
              <p className="text-gray-600">Manage and view all certificates generated by {user?.organisation}</p>
            </div>
            
            {/* Unlock/Decrypt Button */}
            {!isDecrypted && (
              <Button
                onClick={handleUnlockData}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Data
              </Button>
            )}
            
            {isDecrypted && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Lock className="h-4 w-4 mr-1" />
                Data Unlocked
              </Badge>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6 border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by certificate ID, generated ID, or recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 bg-white"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-4 w-4" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48 border-gray-200 bg-white">
                    <SelectValue placeholder="Filter certificates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Certificates</SelectItem>
                    <SelectItem value="recent">Recent (Last 7 days)</SelectItem>
                    <SelectItem value="high-recipients">High Recipients (3+)</SelectItem>
                    <SelectItem value="with-rank">With Rank</SelectItem>
                    <SelectItem value="without-rank">Without Rank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Certificates {!isLoading && `(${totalCount})`}
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                Generated by {user?.organisation}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchCertificates}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Serial No.</TableHead>
                    <TableHead className="text-gray-700">Date</TableHead>
                    <TableHead className="text-gray-700">Event Name</TableHead>
                    <TableHead className="text-gray-700">No. of Recipients</TableHead>
                    <TableHead className="text-gray-700">Generated ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton rows
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-gray-200">
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredCertificates.map((certificate) => (
                      <TableRow key={certificate.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{certificate.serialNumber}</TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(certificate.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }).replace(/\//g, '/')}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">{certificate.certificateId}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto"
                            onClick={() => handleRecipientsClick(certificate)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            {certificate.noOfRecipient} Recipients
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{certificate.generatedId}</code>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {!isLoading && !error && filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No certificates found</p>
                  <p className="text-gray-400 text-sm">You haven&apos;t generated any certificates yet, or try adjusting your search criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {certificates.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} to {Math.min(currentPage * 10, totalCount)} of {totalCount} certificates
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                    className="border-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="border-gray-200"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recipients Modal */}
      <Dialog open={!!selectedCertificate} onOpenChange={closeModal}>
        <DialogContent className="min-w-2xl max-h-[80vh] bg-white border-gray-200">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recipients - {selectedCertificate?.certificateId}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Modal Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recipients by name, email, rank, or UUID..."
                value={recipientSearchTerm}
                onChange={(e) => setRecipientSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 bg-white"
              />
            </div>

            {/* Recipients Table */}
            <div className="overflow-y-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Email</TableHead>
                    <TableHead className="text-gray-700">Rank</TableHead>
                    <TableHead className="text-gray-700">UUID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecipients.map((recipient, index) => (
                    <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{recipient.name}</TableCell>
                      <TableCell className="text-gray-600">{recipient.email || 'N/A'}</TableCell>
                      <TableCell>
                        {recipient.rank ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {recipient.rank}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">No rank</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {recipient.uuid ? (
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono border">
                              {recipient.uuid}
                            </code>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                              Verified
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400">No UUID</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {isDecrypted ? (
                  filteredRecipients.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No recipients found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                  </div>
                )
              ): (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <p className="text-red-400">Cannot Display Details</p>
                  <p className="text-red-300 text-sm">Please Enter Login Password</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredRecipients.length} of {selectedCertificate?.recipients.length || 0} recipients
              </p>
              <Button onClick={closeModal} className="bg-gray-600 hover:bg-gray-700">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Dialog for decrypting certificate data */}
      <PasswordDialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onConfirm={handlePasswordConfirm}
        title="Enter password to decrypt certificate data"
        description="Enter your login password to decrypt and view detailed certificate information including recipient data."
        isLoading={isDecrypting}
      />
    </div>
  </ProtectedRoute>
  )
}
