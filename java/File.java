
Here is a code for testing how lexical analyzer should work 

class File {
	static boolean isPrime ( int c ) // Returns true if c is prime.
	{
		if ( c % 2 == 0 )
			return false ;
		int d ;
		d = 3 ;
		while ( d != c ) // If c < 0 we're in trouble!
		{
			if ( c % d == 0 )
				return false ;
			d = d + 2 ;
		}
		String s = "This is a useless string literal" ;
		return true ;
	}

	/* Find greatest 
	common divisor. */
	static int gcd ( int a , int b )
	{
		String s = " This is an invalid string literal  /// error
		int m ;
		int #23sd ;                                      ///error
		m = b % a ;
		if ( m == 0 )
			return a ;
		else
			return gcd ( m , a ) ;
	}

	static int fibonacci ( int n ) // Find n-th Fibonacci number.
	{
		if ( ( n == 1 ) || ( n == 2 ) )
			return 1 ;
		else
			return fibonacci ( n - 1 ) + fibonacci ( n - 2 ) ;
	}
	
	static float average ( int n1 , int n2 , int n3 )
	{
		float sum = n1 + n2 + n3 ;
		return sum / 3.0 ;
	}
}