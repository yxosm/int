'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

export function AuthModal({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const { signInWithEmail, signUp } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const triggerOpen = () => {
    setOpen(true)
  }

  const validatePassword = (password: string): void => {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }
    // Only checking for minimum 6 characters
  }

  const handleResetPassword = async () => {
    if (!email) {
      setAuthError("Please enter your email address")
      return
    }

    try {
      setIsLoading(true)
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Password Reset Link Sent",
        description: "If an account exists with this email, you will receive a password reset link.",
        duration: 5000,
      })
      setShowResetPassword(false)
      setOpen(false)
    } catch (error) {
      console.error('Reset password error:', error)
      setAuthError(error instanceof Error ? error.message : "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuth = async (action: 'login' | 'signup') => {
    setAuthError(null)

    if (!email || !password) {
      setAuthError("Please enter both email and password")
      return
    }

    try {
      setIsLoading(true)
      const supabase = createClient()
      
      if (action === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) {
          if (loginError.message.toLowerCase().includes('invalid login credentials')) {
            setAuthError("Incorrect email or password")
            toast({
              title: "Login Failed",
              description: "Incorrect email or password",
              variant: "destructive",
            })
          } else {
            setAuthError(loginError.message)
            toast({
              title: "Login Error",
              description: loginError.message,
              variant: "destructive",
            })
          }
          return
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        setOpen(false)

      } else if (action === 'signup') {
        try {
          validatePassword(password)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Password does not meet requirements"
          setAuthError(errorMessage)
          toast({
            title: "Invalid Password",
            description: errorMessage,
            variant: "destructive",
          })
          return
        }

        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })

        if (signUpError) {
          if (signUpError.message.toLowerCase().includes('user already registered')) {
            const errorMsg = "This email is already registered. Please log in instead."
            setAuthError(errorMsg)
            toast({
              title: "Registration Failed",
              description: errorMsg,
              variant: "destructive",
            })
          } else {
            setAuthError(signUpError.message)
            toast({
              title: "Registration Error",
              description: signUpError.message,
              variant: "destructive",
            })
          }
          return
        }

        if (data.user) {
          toast({
            title: "Account Created Successfully!",
            description: "Please check your email for the verification link.",
            duration: 6000,
          })
          setOpen(false)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setAuthError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: 'login' | 'signup') => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleAuth(action);
    }
  };

  if (showResetPassword) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={triggerOpen}>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setAuthError(null)
                }}
                disabled={isLoading}
              />
            </div>
            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}
            <Button 
              className="w-full" 
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowResetPassword(false)}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={triggerOpen}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Account Access</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setAuthError(null)
                  }}
                  onKeyPress={(e) => handleKeyPress(e, 'login')}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input
                  id="password-login"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setAuthError(null)
                  }}
                  onKeyPress={(e) => handleKeyPress(e, 'login')}
                  disabled={isLoading}
                />
              </div>
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
              <Button 
                className="w-full" 
                onClick={() => handleAuth('login')}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground"
                onClick={() => setShowResetPassword(true)}
                disabled={isLoading}
              >
                Forgot Password?
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account? Switch to Sign Up
              </p>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setAuthError(null)
                  }}
                  onKeyPress={(e) => handleKeyPress(e, 'signup')}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setAuthError(null)
                  }}
                  onKeyPress={(e) => handleKeyPress(e, 'signup')}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
              <Button 
                className="w-full" 
                onClick={() => handleAuth('signup')}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account? Switch to Login
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}