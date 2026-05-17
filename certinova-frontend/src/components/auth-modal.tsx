"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, User, Chrome } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

interface AuthModalProps {
  onLogin?: () => void
  triggerText?: string
}

export function AuthModal({ onLogin, triggerText }: AuthModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organisation: ""
  })
  
  const { login, signup, isLoading } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      return
    }

    const success = await login({
      email: formData.email,
      password: formData.password
    })

    if (success) {
      setOpen(false)
      setFormData({ email: "", password: "", organisation: "" })
      onLogin?.()
    }
  }

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.organisation) {
      return
    }

    const success = await signup({
      email: formData.email,
      password: formData.password,
      organisation: formData.organisation
    })

    if (success) {
      setOpen(false)
      setFormData({ email: "", password: "", organisation: "" })
      onLogin?.()
    }
  }

  const handleGoogleAuth = () => {
    toast.error("Google Auth", {
      description: "Beta version doesn't support OAuth"
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerText ? (
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8">
            {triggerText}
          </Button>
        ) : (
          <div className="flex space-x-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">Welcome to CertiNova</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
            <TabsTrigger value="signin" className="data-[state=active]:bg-white">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 bg-transparent"
                disabled={isLoading}
              >
                <Lock className="h-5 w-5 mr-2 text-yellow-400" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10 border-gray-200"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 border-gray-200"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 bg-transparent"
                disabled={isLoading}
              >
                <Lock className="h-5 w-5 mr-2 text-yellow-400" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or create account with email</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organisation-name" className="text-gray-700">
                    Organisation Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="organisation-name" 
                      placeholder="Enter your organisation name" 
                      className="pl-10 border-gray-200"
                      value={formData.organisation}
                      onChange={(e) => handleInputChange("organisation", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-gray-200"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10 border-gray-200"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSignup}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
