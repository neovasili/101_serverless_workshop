

class Repository( object ):

  def __init__( self ):
    pass

  def add( self, object ):
    raise NotImplementedError

  def update( self, object ):
    raise NotImplementedError

  def delete( self, object ):
    raise NotImplementedError

  def get_by_id( self, object ):
    raise NotImplementedError