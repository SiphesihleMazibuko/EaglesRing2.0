"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, User, Mail, Lock, CreditCard, UserPlus, Users } from "lucide-react"

export function SignUpPageComponent() {
  const [userType, setUserType] = useState<string>("")
  const [isInternational, setIsInternational] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength += 25
    if (pass.match(/(?=.*[0-9].*[0-9])/)) strength += 25
    if (pass.match(/(?=.*[!@#$%^&*])/)) strength += 25
    if (pass.match(/(?=.*[a-z])(?=.*[A-Z])/)) strength += 25
    return strength
  }

  const passwordRequirements = [
    { label: "At least 8 characters long", check: (pass: string) => pass.length >= 8 },
    { label: "Contains at least 2 numbers", check: (pass: string) => (pass.match(/\d/g) || []).length >= 2 },
    { label: "Contains at least 1 special character", check: (pass: string) => /[!@#$%^&*]/.test(pass) },
    { label: "Contains uppercase and lowercase letters", check: (pass: string) => /(?=.*[a-z])(?=.*[A-Z])/.test(pass) },
  ]

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password))
  }, [password])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input id="fullname" placeholder="John Doe" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input id="email" type="email" placeholder="john@example.com" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required 
                />
              </div>
              <Progress value={passwordStrength} className="w-full" />
              <div className="space-y-1 mt-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {req.check(password) ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${req.check(password) ? 'text-green-500' : 'text-red-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
              {passwordStrength < 100 && (
                <p className="text-sm text-red-500">
                  {passwordStrength === 0 && "Very Weak"}
                  {passwordStrength === 25 && "Weak"}
                  {passwordStrength === 50 && "Medium"}
                  {passwordStrength === 75 && "Strong"}
                </p>
              )}
              {passwordStrength === 100 && (
                <p className="text-sm text-green-500">Very Strong</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input id="confirm-password" type="password" className="pl-10" required />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="international" checked={isInternational} onCheckedChange={setIsInternational} />
              <Label htmlFor="international">International user</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="id-number">{isInternational ? "Passport Number" : "ID Number"}</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input id="id-number" placeholder={isInternational ? "Enter passport number" : "Enter ID number"} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-type">User Type</Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <Select onValueChange={(value) => setUserType(value)}>
                  <SelectTrigger id="user-type" className="pl-10">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {userType === "investor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mentor1-fullname">Mentor 1 Full Name (Required)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="mentor1-fullname" placeholder="Jane Smith" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mentor1-email">Mentor 1 Email (Required)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="mentor1-email" type="email" placeholder="jane@example.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mentor2-fullname">Mentor 2 Full Name (Optional)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="mentor2-fullname" placeholder="Alex Johnson" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mentor2-email">Mentor 2 Email (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="mentor2-email" type="email" placeholder="alex@example.com" className="pl-10" />
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex-1 bg-primary hidden lg:flex items-center justify-center">
        <div className="relative w-full h-full">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
              <animate attributeName="r" from="0" to="40" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5">
              <animate attributeName="r" from="0" to="30" dur="2s" begin="0.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
              <animate attributeName="r" from="0" to="20" dur="2s" begin="0.6s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
          </div>
        </div>
      </div>
    </div>
  )
}