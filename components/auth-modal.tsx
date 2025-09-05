import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  Mail,
  Lock,
  User,
  Cloud,
  CloudOff,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Laptop,
  Shield,
} from "lucide-react";
import { usePortfolioSync } from "@/hooks/use-portfolio-sync";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    signIn,
    signUp,
    resetPassword,
    user,
    isOnline,
    holdings,
    lastSync,
    isSyncing,
  } = usePortfolioSync();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Successfully signed in!");
        setTimeout(onClose, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Check your email to verify your account.");
        setActiveTab("signin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password reset email sent! Check your inbox.");
        setActiveTab("signin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Si el usuario ya está autenticado, mostrar panel de cuenta
  if (user) {
    return (
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
        <Card className='w-full max-w-md mx-4 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
          <CardHeader className='space-y-1'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-xl font-bold text-white flex items-center'>
                <User className='h-5 w-5 mr-2 text-blue-400' />
                Account Dashboard
              </CardTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='text-slate-400 hover:text-white'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* Estado de conexión */}
            <div className='flex items-center justify-between p-3 bg-slate-800/50 rounded-lg'>
              <div className='flex items-center space-x-3'>
                {isOnline ? (
                  <Cloud className='h-5 w-5 text-green-400' />
                ) : (
                  <CloudOff className='h-5 w-5 text-red-400' />
                )}
                <div>
                  <p className='text-sm font-medium text-white'>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                  <p className='text-xs text-slate-400'>
                    {isSyncing
                      ? "Syncing..."
                      : lastSync
                      ? `Last sync: ${lastSync.toLocaleTimeString()}`
                      : "Not synced"}
                  </p>
                </div>
              </div>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {/* Información del usuario */}
            <div className='space-y-3'>
              <div>
                <Label className='text-slate-300'>Email</Label>
                <p className='text-white font-medium'>{user.email}</p>
              </div>

              <div>
                <Label className='text-slate-300'>Holdings</Label>
                <p className='text-white font-medium'>
                  {holdings.length} cryptocurrencies
                </p>
              </div>
            </div>

            {/* Características sincronizadas */}
            <div className='space-y-2'>
              <Label className='text-slate-300'>Synced Features</Label>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center space-x-2 text-xs text-slate-300'>
                  <CheckCircle className='h-3 w-3 text-green-400' />
                  <span>Portfolio</span>
                </div>
                <div className='flex items-center space-x-2 text-xs text-slate-300'>
                  <CheckCircle className='h-3 w-3 text-green-400' />
                  <span>Alerts</span>
                </div>
                <div className='flex items-center space-x-2 text-xs text-slate-300'>
                  <CheckCircle className='h-3 w-3 text-green-400' />
                  <span>Transactions</span>
                </div>
                <div className='flex items-center space-x-2 text-xs text-slate-300'>
                  <CheckCircle className='h-3 w-3 text-green-400' />
                  <span>Settings</span>
                </div>
              </div>
            </div>

            {/* Características premium */}
            <div className='p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30'>
              <div className='flex items-center space-x-2 mb-2'>
                <Shield className='h-4 w-4 text-purple-400' />
                <span className='text-sm font-medium text-white'>
                  Premium Features
                </span>
              </div>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='flex items-center space-x-1 text-slate-300'>
                  <Smartphone className='h-3 w-3' />
                  <span>Mobile Sync</span>
                </div>
                <div className='flex items-center space-x-1 text-slate-300'>
                  <Laptop className='h-3 w-3' />
                  <span>Multi-Device</span>
                </div>
              </div>
            </div>

            <Button
              onClick={onClose}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            >
              Continue Trading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <Card className='w-full max-w-md mx-4 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
        <CardHeader className='space-y-1'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl font-bold text-white'>
              Join Memento
            </CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='text-slate-400 hover:text-white'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <p className='text-slate-400 text-sm'>
            Sync your portfolio across all your devices
          </p>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='space-y-4'
          >
            <TabsList className='grid w-full grid-cols-3 bg-slate-800'>
              <TabsTrigger value='signin' className='text-xs'>
                Sign In
              </TabsTrigger>
              <TabsTrigger value='signup' className='text-xs'>
                Sign Up
              </TabsTrigger>
              <TabsTrigger value='reset' className='text-xs'>
                Reset
              </TabsTrigger>
            </TabsList>

            {/* Mensajes de error y éxito */}
            {error && (
              <div className='flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg'>
                <AlertTriangle className='h-4 w-4 text-red-400' />
                <span className='text-red-300 text-sm'>{error}</span>
              </div>
            )}

            {success && (
              <div className='flex items-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg'>
                <CheckCircle className='h-4 w-4 text-green-400' />
                <span className='text-green-300 text-sm'>{success}</span>
              </div>
            )}

            <TabsContent value='signin' className='space-y-4'>
              <form onSubmit={handleSignIn} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-slate-300'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password' className='text-slate-300'>
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='password'
                      type='password'
                      placeholder='Enter your password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                      required
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value='signup' className='space-y-4'>
              <form onSubmit={handleSignUp} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='displayName' className='text-slate-300'>
                    Display Name
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='displayName'
                      type='text'
                      placeholder='How should we call you?'
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='signup-email' className='text-slate-300'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='signup-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='signup-password' className='text-slate-300'>
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='signup-password'
                      type='password'
                      placeholder='Create a password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirm-password' className='text-slate-300'>
                    Confirm Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='confirm-password'
                      type='password'
                      placeholder='Confirm your password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                      required
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value='reset' className='space-y-4'>
              <form onSubmit={handleResetPassword} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='reset-email' className='text-slate-300'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
                    <Input
                      id='reset-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='pl-10 bg-slate-800 border-slate-600 text-white'
                      required
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Beneficios de crear cuenta */}
          <div className='mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30'>
            <h3 className='text-sm font-semibold text-white mb-3 flex items-center'>
              <Shield className='h-4 w-4 mr-2 text-purple-400' />
              Why Create an Account?
            </h3>
            <div className='space-y-2 text-xs text-slate-300'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-3 w-3 text-green-400 flex-shrink-0' />
                <span>Sync portfolio across all devices</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-3 w-3 text-green-400 flex-shrink-0' />
                <span>Never lose your holdings data</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-3 w-3 text-green-400 flex-shrink-0' />
                <span>Persistent price alerts</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-3 w-3 text-green-400 flex-shrink-0' />
                <span>Transaction history backup</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='h-3 w-3 text-green-400 flex-shrink-0' />
                <span>Access from mobile & desktop</span>
              </div>
            </div>
          </div>

          {/* Conexión offline */}
          {!isOnline && (
            <div className='mt-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <CloudOff className='h-4 w-4 text-yellow-400' />
                <span className='text-yellow-300 text-sm'>
                  You're offline. Your data will sync when connection returns.
                </span>
              </div>
            </div>
          )}

          {/* Continuar sin cuenta */}
          <div className='mt-4 text-center'>
            <Button
              variant='ghost'
              onClick={onClose}
              className='text-slate-400 hover:text-white text-sm'
            >
              Continue without account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
